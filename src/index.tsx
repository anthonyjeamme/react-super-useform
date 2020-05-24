/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */

/*
 * A simple useForm lib based on a form schema.
 * Then fields can be used by getting field with .get() method.
 * @author: anthonyjeamme
 */

import { useState, useMemo, useCallback } from 'react'

export const STRING_NOT_EMPTY_VALIDATION = (s: string) =>
	typeof s === 'string' && s.length > 0

const getDefaultOfType = (type: any) => {
	return type === String ? '' : type === Boolean ? false : null
}

const getDataFromSchemaAndDefault = (
	schema: any,
	defaultValue: any,
	parent: any
): any => {
	if (schema.type) {
		if (schema.type === Array) {
			return getDataFromSchemaAndDefault(
				{
					_: schema
				},
				{
					_: defaultValue
				},
				parent
			)._
		}

		const value =
			defaultValue && typeof defaultValue !== 'object'
				? defaultValue
				: schema.default || getDefaultOfType(schema.type)

		return {
			__parent: parent,
			type: schema.type,
			value,
			error: false,
			required: schema.required === true,
			validation: schema.validation || (() => true)
		}
	}

	const _ = {
		__parent: parent,
		__schema: schema
	}

	Object.keys(schema).forEach((key) => {
		if (!schema[key].type) {
			_[key] = getDataFromSchemaAndDefault(
				schema[key],
				defaultValue && defaultValue[key] && defaultValue[key],
				_
			)
		} else if (schema[key].type === Array) {
			_[key] = {
				type: Array,
				childrenSchema: schema[key].children,
				schema: schema[key],
				readOnly: schema[key].readOnly,
				validation: schema[key].validation || (() => true),
				max: schema[key].max || Infinity,
				min: schema[key].min || 0,
				__parent: _
			}

			const children =
				defaultValue &&
				defaultValue[key] &&
				schema[key].children.type &&
				schema[key].children.type !== Array
					? defaultValue[key].map((value: any) => ({
							value: value,
							type: schema[key].children.type,
							error: false,
							required: schema[key].children.required === true,
							validation: schema[key].children.validation || (() => true),
							__parent: _[key]
					  }))
					: defaultValue &&
					  defaultValue[key] &&
					  Array.isArray(defaultValue[key])
					? defaultValue[key].map((child: any) =>
							getDataFromSchemaAndDefault(schema[key].children, child, _[key])
					  )
					: (schema[key].default || []).map((child: any) =>
							getDataFromSchemaAndDefault(schema[key].children, child, _[key])
					  ) || []

			if (schema[key].min) {
				if (children.length < schema[key].min) {
					const nChildrenToAdd = schema[key].min - children.length
					// TODO i thing something doesn't works here when default + min
					for (let i = 0; i < nChildrenToAdd; i++) {
						children.push(
							getDataFromSchemaAndDefault(
								schema[key].children,
								defaultValue ? defaultValue[key] : {},
								_[key]
							)
						)
					}
				}
			}

			_[key].children = children
		} else {
			const value =
				defaultValue &&
				defaultValue[key] !== undefined &&
				typeof defaultValue[key] !== 'object'
					? defaultValue[key]
					: schema[key].default || getDefaultOfType(schema[key].type)

			_[key] = {
				type: schema[key].type,
				value,
				error: false,
				required: schema[key].required === true,
				validation: schema[key].validation || (() => true),
				__parent: _
			}
		}
	})

	if (defaultValue) {
		Object.keys(defaultValue).forEach((key) => {
			if (!schema[key]) {
				_[key] = {
					type: typeof defaultValue[key] === 'object' ? Object : String,
					value: defaultValue[key],
					error: false,
					required: false,
					validation: () => true,
					__parent: 'c'
				}
			}
		})
	}

	return _
}

const generateDataFromSchema = (schema: any, defaultValue: any) => {
	return getDataFromSchemaAndDefault(schema, defaultValue, null)
}

type EventName = 'change' | 'submit'

type FormEvent = Array<{
	event: string
	callback: (e: any) => null
}>
/**
 *
 * @param {*} formSchema
 * @param {*} initData
 */
const useForm = (formSchema = {}, initData = null) => {
	const [formData, setFormData] = useState(
		generateDataFromSchema(formSchema, initData)
	)
	const [modified, setModified] = useState(false)
	const [events, setEvents] = useState<FormEvent>([])

	const recursiveGet = (
		parent: any,
		path: string[],
		updateFunction: (data: any) => void,
		pathHistory: string[] = path
	): any => {
		if (path.length === 0) {
			if (parent === undefined) {
				console.error(
					`[react-super-useform] can't find '${[...pathHistory, ...path].join(
						'.'
					)}'`
				)
				return null
			}

			if (parent.type === Array) {
				return {
					error: parent.error,
					length: parent.children.length,
					map: (func: (child: any, i: number) => any) => {
						return parent.children.map((child: any, i: number) => {
							return func(
								{
									...recursiveGet(
										child,
										[],
										(data: any) => {
											updateFunction({
												...parent,
												children: parent.children.map((c: any, _i: number) =>
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
									canBeRemoved: (): boolean => {
										if (parent.min && parent.children.length <= parent.min)
											return false

										return true
									},
									set: (data: any) => {
										const _ = getDataFromSchemaAndDefault(
											parent.childrenSchema,
											data,
											parent
										)

										updateFunction({
											...parent,
											children: parent.children.map((_child: any, _i: any) =>
												i === _i ? _ : _child
											)
										})
									},
									remove: (): any => {
										if (parent.readOnly) return false
										if (parent.min && parent.children.length <= parent.min) {
											console.warn('Impossible to delete')
											return false
										}

										updateFunction({
											...parent,
											children: parent.children.filter(
												(_: any, _i: number) => i !== _i
											)
										})
									}
								},
								i
							)
						})
					},
					toJSON: () => recursiveToJSON(parent),
					set: (data: any) => {
						const _ = getDataFromSchemaAndDefault(
							parent.schema,
							data,
							parent.__parent
						)
						updateFunction(_)
					},
					get: (i: number): any => {
						return recursiveGet(
							parent.children[i],
							[],
							(data: any) => {
								updateFunction({
									...parent,
									children: parent.children.map((c: any, _i: number) =>
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
						)
					},
					canPush: (): boolean => {
						if (parent.readOnly) return false
						if (parent.max && parent.children.length >= parent.max) return false

						return true
					},
					push: (item = null) => {
						if (parent.readOnly) {
							console.warn(`form field '${pathHistory.join('.')}' is readOnly`)
							return
						}

						if (parent.children.length >= parent.max) {
							return
						}

						const newField = getDataFromSchemaAndDefault(
							parent.childrenSchema,
							item,
							parent
						)

						updateFunction({
							...parent,
							children: [...parent.children, newField]
						})
					},
					canRemove: (): boolean => {
						if (parent.readOnly) return false
						if (parent.min && parent.children.length <= parent.min) {
							return false
						}
						return true
					},
					remove: (i: number) => {
						if (parent.min && parent.children.length <= parent.min) {
							console.warn('Impossible to delete')
							return
						}

						updateFunction({
							...parent,
							children: parent.children.filter((_: any, _i: number) => i !== _i)
						})
					}
				}
			} else if (parent.type) {
				return {
					value: parent.value,
					setValue: (value: any) => {
						updateFunction({ value, __error: null })
					},
					error: parent.__error
				}
			} else {
				return {
					get: (name: string) => {
						return recursiveGet(
							parent,
							name.split('.'),
							(data: any) => {
								updateFunction({
									...data
								})
							},
							pathHistory
						)
					},
					toJSON: () => recursiveToJSON(parent),
					set: (data: any) => {
						const newField = getDataFromSchemaAndDefault(
							parent.__schema,
							data,
							parent
						)
						updateFunction({
							...newField
						})
					}
				}
			}
		}
		if (!parent) {
			console.error(
				`[react-super-useform] can't find '${pathHistory.join('.')}'`
			)
			return null
		}

		if (path[0] === 'parent') {
			if (parent.__parent === null) {
				console.error(
					`[react-super-useform] can't find '${pathHistory.join('.')}'`
				)
			}

			return recursiveGet(
				parent.__parent,
				path.slice(1),
				(data: any) => {
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

		if (parent.type === Object) {
			let _v = parent.value

			const key = path[0]
			let _path = [...path]

			while (_path.length > 0) {
				if (typeof _v !== 'object') {
					console.warn(`${path.join('.')} not found`)
					return null
				}
				const key = _path[0]
				_v = _v[key]
				_path = _path.slice(1)
			}

			return {
				value: _v,
				setValue: (v: any) => {
					updateFunction({
						...parent,
						__parent: 'BBB',
						value: {
							...parent.value,
							[key]: v
						},
						__error: null
					})
				}
			}
		}

		if (parent.type === Array) {
			const [index, key] = path

			if (!key) {
				// TODO when we call get('parent') in validation function,
				//   and parent is Array
				return null
			}

			if (!parent.children[index]) {
				console.error(`cannot find index ${index} on ${pathHistory.join('.')}`)
				return
			}

			return recursiveGet(
				parent.children[index][key],
				path.slice(2),
				(data: any) => {
					updateFunction({
						...parent,
						children: parent.children.map((c: any, i: number) =>
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
				(data: any) => {
					const updatedData = {
						...parent,
						[path[0]]: {
							...parent[path[0]],
							...data
						}
					}

					Object.keys(updatedData).forEach((key) => {
						if (
							['__error', '__parent', '__schema'].includes(key) ||
							typeof key === 'object'
						)
							return
						updatedData[key].__parent = updatedData
					})

					updateFunction(updatedData)
				},
				pathHistory
			)
		}
	}

	const get = (name: string) => {
		const path = name.split('.')

		return recursiveGet(
			formData,
			path,
			(data: any) => {
				callEvents('change', recursiveToJSON(data))
				setModified(true)
				setFormData({
					...formData,
					...data
				})
			},
			[]
		)
	}

	const checkErrors = useCallback(() => {
		const result = recursiveUpdateError(formData)

		setFormData(result)
	}, [formData])

	const recursiveUpdateError = (data: any) => {
		if (data.type === Array) {
			const error =
				data.children.length < data.min || !recursiveErrorCheck(data)

			const result = {
				...data,
				children: data.children.map(recursiveUpdateError),
				error
			}

			result.children = result.children.map((child: any) => ({
				...child,
				__parent: result
			}))

			return result
		}

		if (data.type) {
			if (data.validation) {
				if (!data.required) {
					if (!data.value) {
						const result = {
							...data,
							__error: null
						}

						Object.keys(result).forEach((key) => {
							if (['__error', '__parent', '__schema'].includes(key)) return

							if (
								result[key] &&
								typeof result[key] === 'object' &&
								!Array.isArray(result[key])
							)
								result[key].__parent = result
						})

						return result
					}
				}

				if (
					data.validation &&
					typeof data.validation === 'function' &&
					!data.validation(data.value, (pathString: string) => {
						const path = pathString.split('.')

						return recursiveGet(
							path[0] === 'parent' ? data.__parent : formData,
							path.slice(1),
							() => {},
							[]
						)
					})
				) {
					const result = {
						...data,
						__error: true
					}

					return result
				} else {
					return {
						...data,
						__error: null
					}
				}
			}

			return data
		}

		const _data: any = { __parent: null }

		Object.keys(data).forEach((key) => {
			if (['__error', '__parent', '__schema'].includes(key)) return

			_data[key] = recursiveUpdateError(data[key])
			_data[key].__parent = _data
			_data[key].__schema = data[key].__schema
		})

		_data.__error = !recursiveErrorCheck(data) // TODO performance optimization oportunity

		return _data
	}

	const recursiveErrorCheck = (data: any): boolean => {
		if (data.type === Array) {
			if (data.min && data.children.length < data.min) return false

			let isValid = true

			data.children.forEach((child: any) => {
				if (!recursiveErrorCheck(child)) {
					isValid = false
				}
			})

			return isValid
		}

		if (data.type) {
			if (data.validation) {
				if (!data.required && !data.value) return true
				if (typeof data.validation !== 'function') return true

				return data.validation(data.value, (pathString: string) => {
					const path = pathString.split('.')
					return recursiveGet(
						path[0] === 'parent' ? data.__parent : formData,
						path.slice(1),
						() => {},
						[]
					)
				})
			}
			return true
		}

		let isValid = true

		Object.keys(data).forEach((key) => {
			if (['__error', '__parent', '__schema'].includes(key)) return

			if (!recursiveErrorCheck(data[key])) {
				isValid = false
			}
		})

		return isValid
	}

	const recursiveToJSON = (data: any): any => {
		if (data.type === Array) {
			return data.children.map(recursiveToJSON)
		}
		if (data.type) {
			return data.value
		}

		const _data: any = {}

		Object.keys(data).forEach((key) => {
			if (['__error', '__parent', '__schema'].includes(key)) return

			_data[key] = recursiveToJSON(data[key])
			if (data[key].___payload) {
				_data.payload = data[key].___payload
			}
		})

		return _data
	}

	const toJSON = (): any => {
		return recursiveToJSON(formData)
	}

	const isValid: boolean = useMemo(() => recursiveErrorCheck(formData), [
		formData
	])

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		if (!recursiveErrorCheck(formData)) e.preventDefault()
	}

	const callEvents = (eventName: EventName, payload: any) => {
		events
			.filter((event) => event.event === eventName)
			.forEach((event) => {
				event.callback(payload)
			})
	}

	const addEventListener = (event: EventName, callback: (e: any) => null) => {
		if (events.find((e) => e.event === event && e.callback === callback)) return

		setEvents([
			...events,
			{
				event,
				callback
			}
		])
	}
	const removeEventListener = (
		event: EventName,
		callback: (e: any) => null
	) => {
		setEvents(
			events.filter((e) => {
				if (e.event === event && e.callback === callback) return false
				return true
			})
		)
	}

	const recursiveLogErrors = (root: any, path: Array<string>) => {
		if (
			root.__error ||
			root.error /* TODO rename error to __error on Array type ? */
		) {
			if (root.type === Array) {
				root.children.forEach((child: any, i: number) => {
					recursiveLogErrors(child, [...path, `${i}`])
				})
			} else if (root.type) {
				if (root.__error) {
					console.log(`Error on '${path.join('.')}'`)
				}
			} else {
				Object.keys(root)
					.filter((key) => !['__error', '__parent', '__schema'].includes(key))
					.forEach((key) => {
						recursiveLogErrors(root[key], [...path, key])
					})
			}
		}
	}

	const logErrors = () => {
		console.log(formData)
		recursiveLogErrors(formData, [])
	}

	return {
		isValid,
		checkErrors,
		get,
		toJSON,
		handleSubmit,
		formData,
		modified,
		setModified,
		addEventListener,
		removeEventListener,
		logErrors
	}
}

export * from './fields'
export default useForm
