import React, { useState, useEffect } from 'react'

import styled from "styled-components";

import useForm, {text_field, bool_field} from 'react-super-useform'

const uniqid = require('uniqid')

const StyledTextarea = 
styled.textarea`
padding:20px;
border-radius: 6px;
background-color:white;
border:0;
resize:none;
width:100%;
display:block;
margin: 20px 0;
height:200px;
outline:none;
box-shadow: 0 0 20px rgba(0,0,0,0.02)
`;

const StyledInput = 
styled.input`
padding:10px;
border-radius: 6px;
background-color:white;
border:1px solid #eee;
box-shadow: 0 0 20px rgba(0,0,0,0.02);
outline: none;
`;

const StyledButton = 
styled.button`
padding:10px;
border-radius: 6px;
background-color:#3498db;
border:0;
margin: 20px 0;
box-shadow: 0 0 20px rgba(0,0,0,0.02);
cursor:pointer;
color:white;
outline: none;
margin:8px 4px;

transition: background-color 150ms;
&:active{
	background-color:#2586c7;
}
`;
const Container = styled.div`
width: 1000px;
max-width:90vw;
margin:auto;
`
const Input = ({value, setValue, error, ...props}) => (
	<StyledInput style={error ? {
		borderColor:'red'
	} : {}} value={value} onChange={e=>{
		setValue(e.target.value)
	}} {...props}/>
)

const StyledFormGroupLabel = styled.div`
margin-bottom:5px;
`

const StyledFormGroup = styled.div`

margin: 10px 0;
`

const data = {
}

const formSchema = {

	enabled: bool_field(),


	abc: text_field({validation:(value,get)=>{

		console.log('abc => ',get('parent').toJSON().enabled)

		return true
	}}),

	o:{
		def:text_field({validation:(value,get)=>{

			console.log('def => ',get('parent.parent').toJSON().enabled)
	
			return true
		}})
	},

	list:{
		type: Array,
		min:1,
		constrainMinMax:true,
		children:{

			test: text_field({
				validation:(value,get)=>{

					console.log('TEST => ',get('parent.parent.parent').toJSON().enabled)
					return true
				}
			}),
			sublist: {
				type: Array,
				min:1,
				constrainMinMax:true,
				children: {
					name: text_field({
						validation: (value, get) => {

							console.log('NAME => ',get('parent.parent.parent.parent.parent').toJSON().enabled)


							return value.length > 0
						}
					})
				}
			}

		}
	}
}

const Hr = () => (
	<hr style={{height:1, border:0, backgroundColor:'#ddd', margin: "20px 0"}}/>
)

const Checkbox = ({value,setValue}) => {

	return <input type="checkbox" checked={value===true} onChange={()=>{
		setValue(!value)
	}}/>
}

const App = () => {

	const form = useForm(formSchema,null)


	// console.log(form.get('test').get('parent.test.name'))
	form.logErrors()

	console.log(form.formData)


  return (
	<div style={{
		display:'flex',
		flexDirection:'column',
		height:'100vh'
	}}>

		<hr/>


		<div style={{flex:1, overflowY:'auto'}}>
			<Container>

			<div>
				<Checkbox {...form.get('enabled')} />
				Checked
			</div>

			<Input {...form.get('o.def')} />
			{
				form.get('list').map((item,i,id) => (

					<div style={{padding:10,marginBottom:10, backgroundColor:'#fafafa'}}>

						{item.get('sublist').map(subitem => (
							<div>
								<Input {...subitem.get('name')} />
							</div>
						))}

						<button onClick={()=>{
							item.get('sublist').push()
						}}>PUSH</button>

					</div>

				))
			}

			<Hr/>
			<button onClick={()=>{

			form.get('list').push()

			}} style={{width:200, height:42}}>+</button>



				<Hr/>

			</Container>
		</div>

		<footer style={{
			backgroundColor:'white',
			boxShadow:'0 0 20px rgba(0,0,0,0.1)'
		}}>
			<Container>
				
				<div style={{display:'flex', alignItems:'center'}}>

					<div style={{flex:1}}>
 
					{
						form.modified ? '✏️':''
					}

					{
						form.isValid ? '✔️':'❌'
					}

					</div>
					<div>
						<StyledButton onClick={()=>{
							form.logErrors()
							}}>Log Errors</StyledButton>
				
						<StyledButton onClick={()=>{
							form.checkErrors()
							}}>Check Errors</StyledButton>
				
						<StyledButton onClick={()=>{
								console.log(form.toJSON())
							}}>Export JSON</StyledButton>
					</div>


				</div>

			</Container>
		</footer>
	</div>
  )
}

export default App
