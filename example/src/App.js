import React, { useState } from 'react'

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
	activity: {
		title: 'Margotulle',
		pricings: {
			same_pricing: true,
			informations: null,
			pricings_list: ['X', 'Y'],
			pricings_table: [
				{
					_id: '',
					name: 'er',
					description: '23',
					tva: '10',
					time_limit: '2',
					lang: { force: true, selection: [] },
					options: [],
					pricings: [
						{ name: 'X', selling_price: '23', final_price: '', set: true },
						{ name: 'Y', selling_price: '23', final_price: '', set: true }
					]
				}
			]
		},
		administration: { mail: 'av.berthoud@orange.fr', phone: '04 90 74 32 03 ' },
		schedules: { same_schedule: true, schedules_table: [], closed_periods: [] },
		categories: { optionals: [], main: null },
		duration: { days: 0, hours: 1, minutes: 0 },
		contacts: {
			socials: { facebook: '', instagram: '', twitter: '' },
			mail: 'av.berthoud@orange.fr',
			website: null,
			phone: '0490743203'
		},
		apidae: {
			id: '5447799',
			project_id: '3920',
			api_key: '6Zj6vMpk',
			updated: '2020-02-13T11:22:43.215Z',
			last_sync: '2020-03-13T14:53:36.594Z'
		},
		accessibility: {
			public_transports: {
				informations: { bus: '', tram: '', subway: '' },
				accessibility: false
			},
			starting_location: { enabled: 'false', note: '', address: '' },
			restrictions: [],
			indoor: true
		},
		about: {
			note: { description: '' },
			inclusions: { enabled: 'no', has: [], hasnt: [] },
			strong_points: []
		},
		booking: {
			ticket: { type: 'any' },
			cancellation: { unique: true, type: 'standard', weather: false },
			informations: { phone: '', mail: 'av.berthoud@orange.fr' },
			confirmation_method: 'instant',
			confirmation_mail: false,
			each_person_identity: false,
			allow_message: false
		},
		ticketing: {
			enabled: false,
			done: false,
			current_step: 3,
			enabled_date: false
		},
		story_telling: { enabled: false, story: '' },
		slug: 'margotulle',
		description:
			"Modèles de chapeaux déposés de fabrication artisanale, originales fabriqués en France, pour des chapeaux  intemporels et porteurs d’émotions. La marque Margotulle  créations authentiques signées Alain Berthoud.\n\nUn mariage prochainement ? \nL'accessoire qui se mariera forcément à votre tenue !\n\nEn 1993 Alain découvre l’association de deux matières le Tulle et le Raphia, la découverte de l’assemblage de ces deux matières sera le démarrage de collections de chapeaux qui depuis 20 ans charme et ravi une clientèle du Sud de la France.\nMargotulle c’est également une collection Hiver, avec un mélange subtil de matières lainages. Une collection spéciale Homme en augmentation chaque année.\nMargotulle diffuse en participant à de nombreux salons Métiers d’Art en France.\nAdhérent actif des Ateliers d’Art de France depuis 2006 ainsi que l’association des créateurs fabricants de chapeaux ACFC.\n\nVenez nous retrouver dans notre Atelier Boutique à Saignon !",
		search_terms: ['Margotulle', 'Margotulle', 'Saignon', 'Saignon'],
		gallery: [],
		informations: [
			{
				name: 'À savoir',
				name_eng: 'Keep on mind',
				fields: [
					{
						value: 'true',
						name: 'Vente à la propriété',
						name_eng: 'Sales on site',
						type: 'checkbox',
						ui_id: '5de13e9071876108bbbfb508'
					}
				],
				_id: '5e6b9e7059623208b7596fd4',
				ui_id: '5de13b9171876108bbbfb4f3',
				created: '2020-03-13T14:53:36.589Z',
				__v: 0
			},
			{
				name: 'Langue',
				name_eng: 'Language',
				fields: [
					{
						value: [
							{ name: 'Anglais', name_eng: 'Anglais' },
							{ name: 'Français', name_eng: 'Français' }
						],
						name: 'Accueil',
						name_eng: 'Reception desk',
						type: 'multi-selector',
						ui_id: '5de4f3a4389a7b08ba6558c2'
					}
				],
				_id: '5e6b9e1c59623208b7596fca',
				ui_id: '5de13c7071876108bbbfb4f7',
				created: '2020-03-13T14:52:12.360Z',
				__v: 0
			},
			{
				name: 'Pour stationner',
				name_eng: 'Parking facilities',
				fields: [
					{
						value: 'true',
						name: 'Parking à proximité',
						name_eng: 'Parking',
						type: 'checkbox',
						ui_id: '5de146ee71876108bbbfb554'
					}
				],
				_id: '5e6b9e1c59623208b7596fc9',
				ui_id: '5de13cbc71876108bbbfb4f9',
				created: '2020-03-13T14:52:12.360Z',
				__v: 0
			}
		],
		folders: ['5d5063d531d36b081432fd67'],
		favorites: [],
		constraints: [],
		free: true,
		auto: false,
		seen: 0,
		selected: 0,
		_id: '5e6b9e1c59623208b7596fcb',
		preset: '5de4d0fb71876108bbbfb5ce',
		address: {
			postal_code: '84400',
			locality: 'Saignon',
			country: 'France',
			full_address: '182 Rue du Jas, 84400 Saignon, France',
			place_id: 'ChIJsas-H649yhIRnCMWg6Fgri4',
			location: { lng: '5.429406', lat: '43.862373' }
		},
		short_id: '9FmmPVSUF',

		highlights: [],
		created: '2020-03-13T14:52:12.365Z',
		__v: 0,
		end_address: '',
		miniature: { public_id: 'activities/Margotulle', format: 'jpg' }
	}
}



const formSchema = {
	activity: {
		title: text_field(),
		pricings: {
			same_pricing: bool_field(),
			informations: text_field({ required: false }),
			pricings_list: {
				type: Array,
				children: text_field()
			},
			pricings_table: {
				type: Array,
				min:2,
				max:4,
				children: {
					_id: text_field({ readOnly: true, required:false }),
					name: text_field({default:'NOM DE LA PRESTATION'}),
					description: text_field({ required: false }),
					tva: text_field({ required: false }),
					time_limit: text_field({ required: false }),
					lang: {
						force: bool_field(),
						selection: {
							type: Array,
							children: text_field()
						}
					},
					options: {
						type: Array,
						children: {
							name: text_field(),
							selling_price: text_field({ required: false }),
							final_price: text_field({ required: false }),
							tva: text_field({
								required: true,
								validation: () => {
									return true
								}
							}),
							_id: text_field()
						}
					},
					pricings: {
						type: Array,
						min:2,
						children: {
							name: text_field({default:'RIEN'}),
							selling_price: text_field({ required: false }),
							final_price: text_field({ required: false })
						}
					}
				}
			}
		}
	}
}

const Hr = () => (
	<hr style={{height:1, border:0, backgroundColor:'#ddd', margin: "20px 0"}}/>
)

const App = () => {

	const form = useForm(formSchema,data)

	console.log(form.formData)

  return (
	<div style={{
		display:'flex',
		flexDirection:'column',
		height:'100vh'
	}}>

		<div style={{flex:1, overflowY:'auto'}}>

			<Container>

				<h1>Form</h1>
				
				<div>

					{
						form.get('activity.pricings.pricings_table').map(prestation => {

							return (
								<div style={{
									margin:'20px 0',
									padding:20,
									backgroundColor:'white',
									position: 'relative'
								}}>

									<div style={{
										position:'absolute',
										top:20,
										right: 20
									}}>
										{
											prestation.canBeRemoved() && (
												<button onClick={()=>{
													prestation.remove()
												}}>Supprimer</button>
											)
										}
									</div>

									Name

									<br />
									
									<Input {...prestation.get('name')} />

									<Hr/>

									<div>
										{prestation.get('pricings').map(pricing => {


											return (
												<div>
													<Input {...pricing.get('name')} />
												</div>
											)
										})}
									</div>
								</div>
							)
						})
					}

					<div>
						{
							form.get('activity.pricings.pricings_table').canPush() && (
								

								<button onClick={()=>{
									form.get('activity.pricings.pricings_table').push()
								}}>Nouvelle prestation</button>
							)
						}
					</div>
					
				</div>

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
								console.log(form.toJSON().activity.pricings)
							}}>Export JSON</StyledButton>
					</div>


				</div>

			</Container>
		</footer>
	</div>
  )
}

export default App
