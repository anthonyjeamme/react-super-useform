import React, { useState } from 'react'

import styled from "styled-components";

import useForm, {text_field} from 'react-super-useform'


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
border:0;
box-shadow: 0 0 20px rgba(0,0,0,0.02)
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
	<>
	{error && 'ERROR'}
	<StyledInput value={value} onChange={e=>{
		setValue(e.target.value)
	}} {...props}/>
	</>
)

const StyledFormGroupLabel = styled.div`
margin-bottom:5px;
`

const StyledFormGroup = styled.div`

margin: 10px 0;
`

const FormGroup = ({children, label=''}) => (
	<StyledFormGroup>

		<StyledFormGroupLabel>{label}</StyledFormGroupLabel>

			{children}

	</StyledFormGroup>
)

const App = () => {

	const [json, setJson] = useState(null)
	const form = useForm({
		firstname:text_field(),
		lastname:text_field(),
		favorites: {
			type:Array,
			children: {
				name:text_field()
			}
		},
		list:{
			type: Array,
			min: 2,
			children: text_field()
		}
	},{
		firstname:'',
		lastname:'',
		favorites:[],
		list: []
	})

  return (
	<Container>

		<h1>Form</h1>

		<FormGroup label="firstname">
			<Input {...form.get('firstname')}  />
		</FormGroup>

		<FormGroup label="lastname">
			<Input {...form.get('lastname')}  />
		</FormGroup>

		{
			form.get('list').map((item,i) => (
				<div key={item}>

					<Input {...item} />
					{
						item.canBeRemoved() && (
							
							<button onClick={()=>{
								form.get('list').remove(i)
							}}>X</button>
							)
						}
				</div>
			))
		}
		<button onClick={()=>form.get('list').push()}>ADD</button>

		<div>
			<h2>
			Favorites</h2>
			
			{
				form.get('favorites').map((favorite)=>(
					<div style={{marginBottom:10}}>
						<Input {...favorite.get('name')} key={favorite} />
			<StyledButton onClick={()=>{
				favorite.remove()
			}}>Remove</StyledButton>
					</div>
				))
			}

			<br/>

			<StyledButton onClick={()=>{
				form.get('favorites').push()
			}}>Add favorite</StyledButton>

		</div>

	<div>
		<StyledButton onClick={()=>{
			form.checkErrors()
			}}>Check Errors</StyledButton>
		
		<StyledButton onClick={()=>{
				console.log(form.toJSON())
				setJson(JSON.stringify(form.toJSON()))
			}}>Export JSON</StyledButton>
	</div>

		<StyledTextarea value={json} readOnly={true}/>
	</Container>
  )
}

export default App
