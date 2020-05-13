import useForm, { text_field } from '.'

describe('ExampleComponent', () => {
	it('is truthy', () => {
		const formSchema = {
			name: text_field()
		}
		const formData = {
			name: 'hello world'
		}

		const form = useForm(formSchema, formData)

		expect(form.toJSON().name).toEqual('hello world')
	})
})
