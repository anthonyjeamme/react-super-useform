# Warning

Lib is in development. This is an alpha version. ⚠️

# Usage

Installation

```
npm i --save react-super-useform
```


```javascript
import useForm from 'react-super-useform'

const form = useForm(formSchema, initData)
```

# Schema

```javascript
const formSchema = {

	comment: text_field(),
	informations: {
		fistname: text_field(),
		lastname: text_field()
	}
}
```

# Connect form

```JSX
<Input {...form.get('comment')}/>
<Input {...form.get('informations.firstname')}/>
<Input {...form.get('informations.lastname')}/>
```

provide 3 props:
- value
- setValue
- error

you can make your own like that :

```JSX
const Input = ({value, setValue, error}) => (
	<input value={value} onChange={e=>{
		setValue(e.target.value)
	}} className={error?'error':''}/>
)
```

# Arrays

```javascript
const formSchema = {
	list:{
		type: Array,
		children: {
			name: text_field()
		},
	}
}
```

## Add element to list

```javascript
form.get('list').push()
```

## Get elements

```javascript
form.get('list').map((item,i)=>(
	<Input {...item.get('name')}>
))
```

## Get one element

```JSX
<Input {...form.get('list.0.name')}>
```

## Remove an element


```javascript
form.get('list').remove(i)
```

or

```javascript
form.get('list').map((item,i)=>(
	<>
		<button onClick={()=>item.remove()}>
			remove
		</button>
	</>
))
```

# Event

You can subscribe to form event :

```javascript
const myEvent = e => {
	console.log('form has been changed')
}

form.addEventListener('change',myEvent)
```

And unsubscribe

```javascript
form.removeEventListener('change',myEvent)
```

# Error checking

You can know if data are valid in form by reading :

```javascript
form.isValid
```

You can make a check, that set errors on each field list this :

```javascript
form.checkErrors()
```

# Output

```javascript
form.toJSON()
```
