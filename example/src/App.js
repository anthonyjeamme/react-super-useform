import React, { useState, useEffect } from 'react'

import styled from "styled-components";

import useForm, {text_field, bool_field} from 'react-super-useform'


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
	movies:{
		type: Array,
		min:1,
		children:{
			name: text_field(),
			date: text_field(),
			tags:{
				type: Array,
				min:2,
				children: text_field()
			}
		}
	}
}

const Hr = () => (
	<hr style={{height:1, border:0, backgroundColor:'#ddd', margin: "20px 0"}}/>
)

const App = () => {

	const form = useForm(formSchema,data)


	useEffect(()=>{

		form.addEventListener('change', e => {

			console.log('CHANGE',e)
		})
	},[])


  return (
	<div style={{
		display:'flex',
		flexDirection:'column',
		height:'100vh'
	}}>

		<div style={{flex:1, overflowY:'auto'}}>

			<Container>

				<h1>My best movies</h1>
				
				{
					form.get('movies').map(movie => (


						<div style={{
							margin:'0 0 40px 0',
							background:"white",
							padding:20
						}}>
							<div>
								Movie name<br />
								<Input {...movie.get('name')} />
							</div>
							<div>
								Movie date<br />
								<Input {...movie.get('date')} />
							</div>

							<hr/>
							<div>

								<h2>Tags</h2>

								{movie.get('tags').map(tag => (
									<Input {...tag} />
								))}


								<br/>
								<button onClick={()=>(
									movie.get('tags').push()
								)}>Add a tag</button>

							</div>
						</div>

					))
				}

				<hr />

				<button onClick={()=>{
					form.get('movies').push()
				}}>Add a movie</button>
		

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
