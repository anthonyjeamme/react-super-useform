/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */

type FieldParam = {
	required?: boolean
	default?: any
	validation?: (value: any) => boolean
}

// Source: https://emailregex.com/
const VALIDATION_MAIL = (s: string) =>
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		s
	)

// Source: https://stackoverflow.com/questions/38483885/regex-for-french-telephone-numbers
const VALIDATION_PHONE = (s: string) =>
	/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(s)

const field_params = (params: FieldParam = {}) => ({
	required: params.required !== undefined ? params.required : true
})

type PrimitiveField = {
	type: any
	validation?: (s: any) => boolean
	default?: any
} & FieldParam

export const text_field = (params: FieldParam = {}): PrimitiveField => ({
	type: String,
	validation:
		params.validation && typeof params.validation === 'function'
			? params.validation
			: (s: string) => s !== null && s.length > 0,

	default: params.default !== undefined ? params.default : '',
	...field_params(params)
})

/**
 *
 * @param {*} params
 */
export const number_field = (params: FieldParam = {}): PrimitiveField => ({
	type: Number,
	default: params.default !== undefined ? params.default : null,
	validation:
		params.validation && typeof params.validation === 'function'
			? params.validation
			: (v) => v !== null || v === '',
	...field_params(params)
})

/**
 *
 * @param {{
 *   required?: Boolean
 * }} params
 */
export const bool_field = (params: FieldParam = {}): PrimitiveField => ({
	type: Boolean,
	default: params.default || false,
	validation: (v) => v !== null,
	...field_params(params)
})

/**
 *
 * @param {{
 *   required?: Boolean
 * }} params
 */
export const mail_field = (params: FieldParam = {}): PrimitiveField => ({
	type: String,
	validation: VALIDATION_MAIL,
	default: '',
	...field_params(params)
})

/**
 *
 * @param {{
 *   required?: Boolean
 * }} params
 */
export const phone_field = (params: FieldParam = {}): PrimitiveField => ({
	type: String,
	validation: VALIDATION_PHONE,
	default: '',
	...field_params(params)
})

type CreditCardField = {
	ccnumber: PrimitiveField
	ccdate: PrimitiveField
	ccsecuritycode: PrimitiveField
}

export const credit_card_field = (): CreditCardField => ({
	ccnumber: {
		type: String,
		validation: (s: string) => s.length >= 13 && /^[0-9]*$/.test(s)
	},
	ccdate: {
		type: String,
		validation: (s: string) => {
			if (!/^[0-9]{2}\/[0-9]{4}$/.test(s)) return false

			const [mm, yyyy] = s.split('/')
			const year = parseInt(yyyy, 10)
			const month = parseInt(mm, 10)

			if (month < 1 || month > 12) return false

			if (
				year < new Date().getFullYear() ||
				year > new Date().getFullYear() + 50
			)
				return false
			if (
				year === new Date().getFullYear() &&
				month < new Date().getMonth() + 1
			)
				return false

			return true
		}
	},
	ccsecuritycode: {
		type: String,
		validation: (s: string) =>
			typeof s === 'string' && s.length === 3 && /^[0-9]{3}$/.test(s)
	}
})
