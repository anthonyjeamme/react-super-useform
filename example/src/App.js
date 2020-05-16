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
		gallery: [
			{
				infos: { width: 523, height: 800 },
				url:
					'https://cellar-c2.services.clever-cloud.com/monparcours-dev/picture/5e6b9e1c59623208b7596fcd',
				public_id: null,
				format: null,
				parent: '5e6b9e1c59623208b7596fcb',
				apidae_id: '7530526',
				isCover: false,
				type: 'gallery',
				_id: '5e6b9e1c59623208b7596fcd',
				created: '2020-03-13T14:52:12.461Z',
				__v: 0
			},
			{
				infos: { width: 528, height: 800 },
				url:
					'https://cellar-c2.services.clever-cloud.com/monparcours-dev/picture/5e6b9e1c59623208b7596fd0',
				public_id: null,
				format: null,
				parent: '5e6b9e1c59623208b7596fcb',
				apidae_id: '7530527',
				isCover: false,
				type: 'gallery',
				_id: '5e6b9e1c59623208b7596fd0',
				created: '2020-03-13T14:52:12.543Z',
				__v: 0
			},
			{
				infos: { width: 800, height: 533 },
				url:
					'https://cellar-c2.services.clever-cloud.com/monparcours-dev/picture/5e6b9e1c59623208b7596fd2',
				public_id: null,
				format: null,
				parent: '5e6b9e1c59623208b7596fcb',
				apidae_id: '7530528',
				isCover: false,
				type: 'gallery',
				_id: '5e6b9e1c59623208b7596fd2',
				created: '2020-03-13T14:52:12.699Z',
				__v: 0
			},
			{
				infos: { width: 800, height: 533 },
				url:
					'https://cellar-c2.services.clever-cloud.com/monparcours-dev/picture/5e6b9e1c59623208b7596fd3',
				public_id: null,
				format: null,
				parent: '5e6b9e1c59623208b7596fcb',
				apidae_id: '7530529',
				isCover: false,
				type: 'gallery',
				_id: '5e6b9e1c59623208b7596fd3',
				created: '2020-03-13T14:52:12.814Z',
				__v: 0
			},
			{
				infos: { width: 533, height: 800 },
				url:
					'https://cellar-c2.services.clever-cloud.com/monparcours-dev/picture/5e6b9e1c59623208b7596fcf',
				public_id: null,
				format: null,
				parent: '5e6b9e1c59623208b7596fcb',
				apidae_id: '7530530',
				isCover: false,
				type: 'gallery',
				_id: '5e6b9e1c59623208b7596fcf',
				created: '2020-03-13T14:52:12.541Z',
				__v: 0
			},
			{
				infos: { width: 800, height: 600 },
				url:
					'https://cellar-c2.services.clever-cloud.com/monparcours-dev/picture/5e6b9e1c59623208b7596fce',
				public_id: null,
				format: null,
				parent: '5e6b9e1c59623208b7596fcb',
				apidae_id: '7530531',
				isCover: false,
				type: 'gallery',
				_id: '5e6b9e1c59623208b7596fce',
				created: '2020-03-13T14:52:12.538Z',
				__v: 0
			},
			{
				infos: { width: 800, height: 533 },
				url:
					'https://cellar-c2.services.clever-cloud.com/monparcours-dev/picture/5e6b9e1c59623208b7596fd1',
				public_id: null,
				format: null,
				parent: '5e6b9e1c59623208b7596fcb',
				apidae_id: '7530532',
				isCover: false,
				type: 'gallery',
				_id: '5e6b9e1c59623208b7596fd1',
				created: '2020-03-13T14:52:12.675Z',
				__v: 0
			}
		],
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
		destinations: [
			{
				sections: [
					{
						categories: { optionals: [], main: '5d42df754eed230685ea3476' },
						_id: '5e6b9e7059623208b7596fd9',
						name: 'day'
					},
					{
						categories: { optionals: [] },
						_id: '5e6b9e7059623208b7596fd8',
						name: 'cultural_agenda'
					},
					{
						categories: { optionals: [] },
						_id: '5e6b9e7059623208b7596fd7',
						name: 'restaurants'
					},
					{
						categories: { optionals: [] },
						_id: '5e6b9e7059623208b7596fd6',
						name: 'stays'
					}
				],
				_id: '5e6b9e7059623208b7596fd5',
				data: {
					name: "Pays d'Apt Luberon",
					_id: '5d5063d531d36b081432fd67',
					sections: [
						{
							label: 'En journée',
							label_as: 'En journée',
							has_courses: true,
							categories: [
								{
									label_as: 'Musées',
									order: 1,
									_id: '5e400b747017db08b981082f',
									data: {
										name: 'Musées',
										optional: false,
										_id: '5d42a1ef4eed230685ea3406',
										created: '2019-08-01T08:25:19.456Z',
										__v: 0,
										icon: '5e456ea9fca0c708b7f195fe',
										_icon: {
											height: 50,
											width: 50,
											public_id: 'activities/categories Musees',
											format: 'png'
										}
									}
								},
								{
									label_as: 'Vélo',
									order: 3,
									_id: '5e400b747017db08b981082e',
									data: {
										name: 'Vélo',
										optional: false,
										_id: '5d42a2074eed230685ea3408',
										icon: '5e456ecbfca0c708b7f195ff',
										created: '2019-08-01T08:25:43.292Z',
										__v: 0,
										_icon: {
											height: 50,
											width: 50,
											public_id: 'activities/categories Velo',
											format: 'png'
										}
									}
								},
								{
									label_as: 'Randonnées',
									order: 2,
									_id: '5e400b747017db08b981082d',
									data: {
										name: 'Randonnées',
										optional: false,
										_id: '5d42a20d4eed230685ea3409',
										icon: '5e456ed4fca0c708b7f19600',
										created: '2019-08-01T08:25:49.877Z',
										__v: 0,
										_icon: {
											height: 49,
											width: 50,
											public_id: 'activities/categories Randonnees',
											format: 'png'
										}
									}
								},
								{
									label_as: 'Sites et Patrimoines',
									order: 4,
									_id: '5e400b747017db08b981082b',
									data: {
										name: 'Sites et Patrimoines',
										optional: false,
										_id: '5d42df2d4eed230685ea346e',
										icon: '5e456efdfca0c708b7f19603',
										created: '2019-08-01T12:46:37.370Z',
										__v: 0,
										_icon: {
											height: 50,
											width: 50,
											public_id: 'activities/categories Sites et Patrimoines',
											format: 'png'
										}
									}
								},
								{
									label_as: 'Activités',
									order: 5,
									_id: '5e400b747017db08b981082a',
									data: {
										name: 'Activités',
										optional: false,
										_id: '5d42df3d4eed230685ea3470',
										icon: '5e456f0bfca0c708b7f19604',
										created: '2019-08-01T12:46:53.972Z',
										__v: 0,
										_icon: {
											height: 50,
											width: 50,
											public_id: 'activities/categories Activites',
											format: 'png'
										}
									}
								},
								{
									label_as: 'Marché',
									order: 7,
									_id: '5e400b747017db08b9810829',
									data: {
										name: 'Marché',
										optional: false,
										_id: '5d42df4b4eed230685ea3472',
										icon: '5e456f18fca0c708b7f19605',
										created: '2019-08-01T12:47:07.650Z',
										__v: 0,
										_icon: {
											height: 50,
											width: 50,
											public_id: 'activities/categories Marche',
											format: 'png'
										}
									}
								},
								{
									label_as: 'Shopping',
									order: 8,
									_id: '5e400b747017db08b9810828',
									data: {
										name: 'Shopping',
										optional: false,
										_id: '5d42df754eed230685ea3476',
										icon: '5e456f33fca0c708b7f19607',
										created: '2019-08-01T12:47:49.703Z',
										__v: 0,
										_icon: {
											height: 44,
											width: 50,
											public_id: 'activities/categories Shopping',
											format: 'png'
										}
									}
								},
								{
									label_as: 'Villages',
									order: 9,
									_id: '5e400b747017db08b9810827',
									data: {
										name: 'Villages',
										optional: false,
										_id: '5d42df904eed230685ea3479',
										icon: '5e456f3ffca0c708b7f19608',
										created: '2019-08-01T12:48:16.819Z',
										__v: 0,
										_icon: {
											height: 45,
											width: 50,
											public_id: 'activities/categories Villages',
											format: 'png'
										}
									}
								},
								{
									label_as: 'Nature Vivante',
									order: 10,
									_id: '5e400b747017db08b9810826',
									data: {
										name: 'Nature Vivante',
										optional: false,
										_id: '5d7e9ba978aae00810c04535',
										created: '2019-09-15T20:14:33.120Z',
										__v: 0,
										icon: '5e456f4bfca0c708b7f19609',
										_icon: {
											height: 50,
											width: 50,
											public_id: 'activities/categories Nature Vivante',
											format: 'png'
										}
									}
								},
								{
									label_as: 'Bien-Être',
									order: 11,
									_id: '5e400b747017db08b9810825',
									data: {
										name: 'Bien-Être',
										optional: false,
										_id: '5e1af917f4e28a08c4eec234',
										created: '2020-01-12T10:46:47.889Z',
										__v: 0,
										icon: '5e456f54fca0c708b7f1960a',
										_icon: {
											height: 50,
											width: 50,
											public_id: 'activities/categories Bien Etre',
											format: 'png'
										}
									}
								},
								{
									label_as: 'En famille',
									order: 12,
									_id: '5e400b747017db08b9810824',
									data: {
										name: 'En famille',
										optional: true,
										_id: '5d42a3d64eed230685ea3415',
										icon: '5e456fb3fca0c708b7f1960e',
										created: '2019-08-01T08:33:26.277Z',
										__v: 0,
										_icon: {
											height: 50,
											width: 45,
											public_id: 'activities/categories En famille',
											format: 'png'
										}
									}
								},
								{
									label_as: 'Avec animaux',
									order: 13,
									_id: '5e400b747017db08b9810823',
									data: {
										name: 'Avec animaux',
										optional: true,
										_id: '5d42dfae4eed230685ea347b',
										icon: '5e456fbcfca0c708b7f1960f',
										created: '2019-08-01T12:48:46.480Z',
										__v: 0,
										_icon: {
											height: 46,
											width: 50,
											public_id: 'activities/categories Avec animaux',
											format: 'png'
										}
									}
								}
							],
							_id: '5e400b747017db08b9810822',
							name: 'day'
						}
					]
				}
			}
		],
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
				children: {
					_id: text_field({ readOnly: true, required:false }),
					name: text_field(),
					description: text_field(),
					tva: text_field(),
					time_limit: text_field(),
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
							selling_price: text_field(),
							final_price: text_field(),
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
						children: {
							name: text_field(),
							selling_price: text_field(),
							final_price: text_field()
						}
					}
				}
			}
		}
	}
}

const App = () => {

	const [json, setJson] = useState(null)
	const form = useForm(formSchema,data)

	console.log(form.formData)

  return (
	<Container>

		<h1>Form</h1>


		<button onClick={()=>{


console.log(
	form.get('activity.pricings.pricings_table').toJSON())
		}}>
			TEST
		</button>

		<Input {...form.get('activity.title')} />


	<div>

<div>{form.isValid?'valid':'no valid'}</div>

	{
		form.modified ? 'MODIFIED':'NOT MODIFIED'
	}

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
