# Usage

    import useForm from './useForm.js'

And then

    const form = useForm(formSchema, initData)

# Schema

	const formSchema = {

		comment: text_field(),
		informations: {
			fistname: text_field(),
			lastname: text_field()
		}
	}

# Connect form

    <Input {...form.get('comment')}/>
	<Input {...form.get('informations.firstname')}/>
	<Input {...form.get('informations.lastname')}/>

provide 3 props:
- value
- setValue
- error

you can make your own like that :

	const Input = ({value, setValue, error}) => (
		<input value={value} onChange={e=>{
			setValue(e.target.value)
		}} className={error?'error':''}/>
	)

# Arrays

    const formSchema = {
		list:{
			type: Array,
			children: {
				name: text_field()
			},
		}
	}

## Add element to list

	form.get('list').push()

## Get elements

	form.get('list').map((item,i)=>(
		<Input {...item.get('name')}>
	))

## Get one element

	<Input {...form.get('list.0.name')}>

## Remove an element

	form.get('list').remove(i)

or


	form.get('list').map((item,i)=>(
		<>
			<button onClick={()=>item.remove()}>
				remove
			</button>
		</>
	))

# Error checking

You can know if data are valid in form by reading :

	form.isValid

You can make a check, that set errors on each field list this :

	form.checkErrors()

# Output

	form.toJSON()