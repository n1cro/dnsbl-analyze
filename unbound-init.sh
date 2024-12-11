#!/bin/bash

# Проверка наличия переменной окружения с IP
if [ -z "$IPS" ]; then
  echo "Ошибка: Переменная окружения IPS не задана."
  exit 1
fi

# Интерфейс для добавления IP
INTERFACE=${INTERFACE:-"ens19"}
CONFIG_DIR="/etc/unbound/unbound.conf.d"

# Проверка наличия директории для конфигов
if [ ! -d "$CONFIG_DIR" ]; then
  echo "Создаю директорию $CONFIG_DIR"
  mkdir -p "$CONFIG_DIR"
fi

# Шаблон конфига
CONFIG_TEMPLATE='server:
    interface: ${IP}
    access-control: ${IP}/32 allow
    access-control: ::1 allow
    cache-max-ttl: 14400
    cache-min-ttl: 300
    do-ip4: yes
    do-ip6: no
    do-udp: yes
    do-tcp: yes
    use-caps-for-id: no
    prefetch: yes
    verbosity: 2'

add_ip_to_interface() {
  local ip=$1
  if ! ip addr show "$INTERFACE" | grep -q "$ip"; then
    echo "Добавляю IP $ip на интерфейс $INTERFACE"
    ip addr add "$ip"/32 dev "$INTERFACE"
  else
    echo "IP $ip уже добавлен на интерфейс $INTERFACE"
  fi
}

create_unbound_config() {
  local ip=$1
  local config_file="$CONFIG_DIR/unbound_${ip//./_}.conf"
  echo "Создаю конфиг для Unbound: $config_file"
  echo "${CONFIG_TEMPLATE//\$\{IP\}/$ip}" > "$config_file"
}

start_unbound_instance() {
  local ip=$1
  local config_file="$CONFIG_DIR/unbound_${ip//./_}.conf"
  echo "Запускаю Unbound с конфигом $config_file"
  unbound -c "$config_file" &
}

# Разделение списка IP (IPS) на массив
IFS=',' read -r -a IP_ARRAY <<< "$IPS"

# Основной цикл обработки IP-адресов
for ip in "${IP_ARRAY[@]}"; do
  add_ip_to_interface "$ip"
  create_unbound_config "$ip"
  start_unbound_instance "$ip"
done

echo "Все инстансы Unbound запущены."
