import {
	registerDecorator,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCidrConstraint implements ValidatorConstraintInterface {
	private cidrRegex = new RegExp(
		'^(25[0-5]|2[0-4]\\d|[01]?\\d?\\d)' +
			'(\\.(25[0-5]|2[0-4]\\d|[01]?\\d?\\d)){3}' +
			'\\/(3[0-2]|[12]\\d|\\d)$'
	);

	validate(value: any): boolean {
		return typeof value === 'string' && this.cidrRegex.test(value);
	}

	defaultMessage() {
		return 'invalid CIDR format';
	}
}

export function IsCidr(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'isCidr',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: IsCidrConstraint
		});
	};
}
