/*
 * A simple useForm lib based on a form schema.
 * Then fields can be used by getting field with .get() method.
 * @author: anthonyjeamme
 */

import { useState } from 'react'

export const STRING_NOT_EMPTY_VALIDATION = s =>
	typeof s === 'string' && s.length > 0

// Source: https://emailregex.com/
const VALIDATION_MAIL = s =>
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		s
	)

// Source: https://stackoverflow.com/questions/38483885/regex-for-french-telephone-numbers
const VALIDATION_PHONE = s =>
	/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(s)

/**
 *
 * @param {{
 *   required?: Boolean
 * }} params
 */
const field_params = (params = {}) => ({
	required: params.required !== undefined ? params.required : true
})

/**
 *
 * @param {{
 *   required?: Boolean
 * }} params
 */
export const text_field = (params = {}) => ({
	type: String,
	validation: s => s.length > 0,
	default: params.default || '',
	...field_params(params)
})

/**
 *
 * @param {*} params
 */
export const number_field = (params = {}) => ({
	type: Number,
	default: params.default || null,
	validation: () => true,
	...field_params(params)
})

/**
 *
 * @param {{
 *   required?: Boolean
 * }} params
 */
export const bool_field = (params = {}) => ({
	type: Boolean,
	default: params.default || false,
	validation: () => true,
	...field_params(params)
})

/**
 *
 * @param {{
 *   required?: Boolean
 * }} params
 */
export const mail_field = (params = {}) => ({
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
export const phone_field = (params = {}) => ({
	type: String,
	validation: VALIDATION_PHONE,
	default: '',
	...field_params(params)
})

/**
 *
 * @param {{
 *   required?: Boolean
 * }} params
 */
export const credit_card_field = (params = {}) => ({
	ccnumber: {
		type: String,
		validation: s => s.length >= 13 && /^[0-9]*$/.test(s)
	},
	ccdate: {
		type: String,
		validation: s => {
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
		validation: s =>
			typeof s === 'string' && s.length === 3 && /^[0-9]{3}$/.test(s)
	}
})

const getDefaultOfType = type => {
	return type === String ? '' : type === Boolean ? false : null
}

const getDataFromSchemaAndDefault = (schema, defaultValue) => {
	const _ = {}

	Object.keys(schema).forEach(key => {
		if (!schema[key].type) {
			_[key] = generateDataFromSchema(
				schema[key],
				defaultValue && defaultValue[key] && defaultValue[key]
			)
		} else if (schema[key].type === Array) {
			const children =
				defaultValue &&
				defaultValue[key] &&
				schema[key].children.type &&
				schema[key].children.type !== Array
					? defaultValue[key].map(value => ({
							value: value,
							type: schema[key].children.type,
							error: false,
							required: schema[key].children.required === true,
							validation: schema[key].children.validation || (() => true)
					  }))
					: defaultValue &&
					  defaultValue[key] &&
					  Array.isArray(defaultValue[key])
					? defaultValue[key].map(child =>
							getDataFromSchemaAndDefault(schema[key].children, child)
					  )
					: (schema[key].default || []).map(child =>
							getDataFromSchemaAndDefault(schema[key].children, child)
					  ) || []

			_[key] = {
				type: Array,
				children,
				childrenSchema: schema[key].children,
				readOnly: schema[key].readOnly,
				validation: schema[key].validation || (() => true),
				max: schema[key].max || Infinity,
				min: schema[key].min || 0
			}
		} else {
			const value =
				defaultValue &&
				defaultValue[key] &&
				typeof defaultValue[key] !== 'object'
					? defaultValue[key]
					: schema[key].default || getDefaultOfType(schema[key].type)

			_[key] = {
				type: schema[key].type,
				value,
				error: false,
				required: schema[key].required === true,
				validation: schema[key].validation || (() => true)
			}
		}
	})
	return _
}

const generateDataFromSchema = (schema, defaultValue) => {
	return getDataFromSchemaAndDefault(schema, defaultValue)
}

/**
 *
 * @param {*} formSchema
 * @param {*} initData
 */
export const useForm = (formSchema = {}, initData = null) => {
	const [formData, setFormData] = useState(
		generateDataFromSchema(formSchema, initData)
	)

	const recursiveFieldUpdate = (data, path, value) => {
		if (path.length === 0) {
			if (data.type === Array) {
				return value
			} else {
				return {
					...data,
					value
				}
			}
		}

		if (data.type === Array) {
			return {
				...data,
				children: data.children.map((child, i) =>
					i === path[0]
						? recursiveFieldUpdate(data.children[path[0]], path.slice(1), value)
						: child
				)
			}
		}

		return {
			...data,
			[path[0]]: recursiveFieldUpdate(data[path[0]], path.slice(1), value)
		}
	}

	const recursiveGet = (parent, path, updateFunction, pathHistory = path) => {
		if (path.length === 0) {
			if (parent.type === Array) {
				return {
					error: parent.error,
					map: func => {
						return parent.children.map((child, i) => {
							return func(
								{
									...recursiveGet(
										child,
										[],
										data => {
											updateFunction({
												...parent,
												children: parent.children.map((c, _i) =>
													_i === i
														? {
																...c,
																...data
														  }
														: c
												)
											})
										},
										pathHistory
									),
									remove: () => {
										updateFunction({
											...parent,
											children: parent.children.filter((_, _i) => i !== _i)
										})
									}
								},
								i
							)
						})
					},
					push: (item = {}) => {
						if (parent.readOnly) {
							throw `form field is readOnly`
						}

						if (parent.children.length >= parent.max) {
							return
						}

						const newField = getDataFromSchemaAndDefault(
							parent.childrenSchema,
							item
						)

						updateFunction({
							...parent,
							children: [...parent.children, newField]
						})
					},
					remove: i => {
						updateFunction({
							...parent,
							children: parent.children.filter((_, _i) => i !== _i)
						})
					}
				}
			} else if (parent.type) {
				return {
					value: parent.value,
					setValue: value => {
						updateFunction({ value })
					},
					error: parent.error
				}
			} else {
				return {
					get: name => {
						return recursiveGet(
							parent,
							name.split('.'),
							data => {
								updateFunction({
									...data
								})
							},
							pathHistory
						)
					}
				}
			}
		}

		if (!parent) {
			console.error(`unknown field '${pathHistory.join('.')}'`)
			return null
		}

		if (parent.type === Array) {
			const [index, key] = path

			if (!parent.children[index]) {
				console.error(`cannot find index ${index} on ${pathHistory.join('.')}`)
				return
			}

			return recursiveGet(
				parent.children[index][key],
				path.slice(2),
				data => {
					updateFunction({
						...parent,
						children: parent.children.map((c, i) =>
							i === parseInt(index, 10)
								? {
										...c,
										[key]: {
											...c[key],
											...data
										}
								  }
								: c
						)
					})
				},
				pathHistory
			)
		} else {
			return recursiveGet(
				parent[path[0]],
				path.slice(1),
				data => {
					updateFunction({
						...parent,
						[path[0]]: {
							...parent[path[0]],
							...data
						}
					})
				},
				pathHistory
			)
		}
	}

	const get = name => {
		const path = name.split('.')

		return recursiveGet(formData, path, data => {
			setFormData({
				...formData,
				...data
			})
		})
	}

	const checkErrors = () => {
		setFormData(recursiveUpdateError(formData))
	}

	const recursiveUpdateError = data => {
		if (data.type === Array) {
			const error =
				data.children.length < data.min || !recursiveErrorCheck(data)

			return {
				...data,
				children: data.children.map(recursiveUpdateError),
				error
			}
		}

		if (data.type) {
			if (data.validation) {
				if (!data.required) {
					if (!data.value)
						return {
							...data,
							error: null
						}
				}
				if (!data.validation(data.value)) {
					return {
						...data,
						error: true
					}
				} else {
					return {
						...data,
						error: null
					}
				}
			}

			return data
		}

		const _data = {}

		Object.keys(data).forEach(key => {
			_data[key] = recursiveUpdateError(data[key])
		})

		_data.__error = !recursiveErrorCheck(data)

		return _data
	}

	const recursiveErrorCheck = data => {
		if (data.type === Array) {
			if (data.min && data.children.length < data.min) return false

			let isValid = true

			data.children.forEach(child => {
				if (!recursiveErrorCheck(child)) {
					isValid = false
				}
			})

			return isValid
		}

		if (data.type) {
			if (data.validation) {
				if (!data.required && !data.value) return true

				return data.validation(data.value)
			}
			return true
		}

		let isValid = true

		Object.keys(data).forEach(key => {
			if (!recursiveErrorCheck(data[key])) {
				isValid = false
			}
		})

		return isValid
	}

	const recursiveToJSON = data => {
		if (data.type === Array) {
			return data.children.map(recursiveToJSON)
		}
		if (data.type) {
			return data.value
		}

		const _data = {}

		Object.keys(data).forEach(key => {
			_data[key] = recursiveToJSON(data[key])
			if (data[key].___payload) {
				_data.payload = data[key].___payload
			}
		})

		return _data
	}

	const toJSON = () => {
		return recursiveToJSON(formData)
	}

	const isValid = recursiveErrorCheck(formData)

	const handleSubmit = e => {
		if (!recursiveErrorCheck(formData)) e.preventDefault()
	}

	return {
		isValid,
		checkErrors,
		get,
		toJSON,
		handleSubmit
	}
}
