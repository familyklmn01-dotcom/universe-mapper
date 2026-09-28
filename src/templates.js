const node=(id,name,type,x,y,parentId=null,value='')=>({id,structureId:'main',parentId,name,type,value,status:'draft',x,y,width:type==='circle'?140:184,height:type==='circle'?140:64,fields:[]})
const base=(name,description,nodes,relationships=[],formulas=[],scenarios=[])=>({universe:{id:`template-${name.toLowerCase().replace(/\W+/g,'-')}`,name,description},structures:[{id:'main',name:'Main Structure',description}],nodes,relationships,formulas,scenarios,savedViews:[],layout:{preset:'manual',direction:'tb',scope:'universe',manualPositions:{}}})

const blank=()=>base('Untitled Universe','Start from an empty canvas.',[])
const mindmap=()=>base('Mind Map','Organize ideas around one central topic.',[
  node('topic','Main Topic','circle',650,330),node('idea-a','Idea A','category',300,180,'topic'),node('idea-b','Idea B','category',1000,180,'topic'),node('idea-c','Idea C','category',300,560,'topic'),node('idea-d','Idea D','category',1000,560,'topic')
])
const hierarchy=()=>base('Hierarchy Map','Map levels of ownership or structure.',[
  node('root','Organization','category',650,100),node('branch-a','Branch A','category',360,310,'root'),node('branch-b','Branch B','category',650,310,'root'),node('branch-c','Branch C','category',940,310,'root'),node('child-a','Child A','category',360,520,'branch-a'),node('child-b','Child B','category',650,520,'branch-b')
])
const flowchart=()=>base('Process Flow','Build a sequential operational process.',[
  node('start','Start','start/end',100,300),node('step-1','Process Step','process',380,300),node('check','Decision?','decision',680,290),node('finish','Finish','start/end',1000,300)
],[{id:'r1',sourceId:'start',targetId:'step-1',type:'influences',weight:1},{id:'r2',sourceId:'step-1',targetId:'check',type:'influences',weight:1},{id:'r3',sourceId:'check',targetId:'finish',type:'influences',weight:1}])
const decision=()=>base('Decision Tree','Compare Yes and No decision paths.',[
  node('question','Decision Question?','decision',600,100),node('yes','Yes Path','process',330,360),node('no','No Path','process',870,360),node('yes-result','Yes Result','start/end',330,590),node('no-result','No Result','start/end',870,590)
],[{id:'r1',sourceId:'question',targetId:'yes',type:'yes',weight:1},{id:'r2',sourceId:'question',targetId:'no',type:'no',weight:1},{id:'r3',sourceId:'yes',targetId:'yes-result',type:'influences',weight:1},{id:'r4',sourceId:'no',targetId:'no-result',type:'influences',weight:1}])
const fishbone=()=>base('Fishbone Analysis','Identify root causes using the 6M framework.',[
  node('effect','Problem / Effect','category',1080,350),
  node('people','People','category',180,80,'effect'),node('method','Method','category',470,80,'effect'),node('machine','Machine','category',760,80,'effect'),
  node('material','Material','category',180,620,'effect'),node('measurement','Measurement','category',470,620,'effect'),node('environment','Environment','category',760,620,'effect'),
  node('cause-people','Possible Cause','text',160,210,'people'),node('cause-method','Possible Cause','text',450,210,'method'),node('cause-machine','Possible Cause','text',740,210,'machine'),
  node('cause-material','Possible Cause','text',160,500,'material'),node('cause-measurement','Possible Cause','text',450,500,'measurement'),node('cause-environment','Possible Cause','text',740,500,'environment')
],[...['people','method','machine','material','measurement','environment'].map((id,index)=>({id:`bone-${index}`,sourceId:id,targetId:'effect',type:'contributes_to',weight:1}))])
const causal=()=>base('Causal Map','Explore reinforcing and reducing influences.',[
  node('outcome','Desired Outcome','circle',620,320),node('driver-a','Driver A','metric',250,150),node('driver-b','Driver B','metric',990,150),node('risk','Risk Factor','metric',620,620)
],[{id:'r1',sourceId:'driver-a',targetId:'outcome',type:'increases',weight:1},{id:'r2',sourceId:'driver-b',targetId:'outcome',type:'increases',weight:1},{id:'r3',sourceId:'risk',targetId:'outcome',type:'decreases',weight:1}])
const kpi=()=>base('KPI Formula Model','Calculate a result from measurable inputs.',[
  node('sales','Sales','number',220,220,null,100),node('quality','Quality Score','percentage',220,460,null,80),node('score','Performance Score','metric',760,330,null,90)
],[],[{id:'formula-score',name:'Performance Score',nodeId:'score',targetNodeId:'score',expression:'AVERAGE(Sales,Quality_Score)',inputs:['sales','quality'],outputType:'number',unit:'',status:'valid'}])
const simulation=()=>base('Motorcycle Production Simulation','End-to-end motorcycle production capacity, quality, inventory, and target scenarios.',[
  node('target','Daily Production Target','number',80,80,null,500),node('lines','Active Production Lines','number',80,190,null,4),node('hours','Working Hours Day','number',80,300,null,16),node('cycle','Cycle Time Minutes','number',80,410,null,7.2),
  node('raw-stock','Raw Material Stock','number',350,80,null,620),node('pressing','Pressing & Welding','process',350,210),node('press-yield','Body Line Yield','percentage',350,330,null,97),node('body-good','Good Body Units','metric',350,460,null,0),
  node('paint-stock','Paint & Decal Stock','number',620,80,null,560),node('painting','Painting / Printing Line','process',620,210),node('paint-yield','Paint Line Yield','percentage',620,330,null,95),node('paint-good','Good Painted Body','metric',620,460,null,0),
  node('engine-stock','Engine Supply','number',890,80,null,490),node('engine-line','Engine Preparation Line','process',890,210),node('assembly','Main Assembly Line','process',890,350),node('assembly-yield','Assembly Yield','percentage',890,470,null,96),node('assembled-good','Good Assembled Units','metric',890,590,null,0),
  node('quality','Final Quality Inspection','decision',1160,250),node('final-yield','Final Inspection Yield','percentage',1160,390,null,98),node('good-units','GOOD Motorcycles','metric',1160,530,null,0),node('reject-units','NOT GOOD / Rework','metric',1160,650,null,0),
  node('fg-warehouse','Finished Goods Warehouse','process',1430,430),node('shipment','Ready for Shipment','metric',1430,560,null,0),node('achievement','Target Achievement','percentage',1430,690,null,0)
],[
  {id:'flow-1',sourceId:'raw-stock',targetId:'pressing',type:'influences',weight:'material'},{id:'flow-2',sourceId:'pressing',targetId:'body-good',type:'increases',weight:'body output'},{id:'flow-3',sourceId:'body-good',targetId:'painting',type:'influences',weight:'WIP body'},{id:'flow-4',sourceId:'paint-stock',targetId:'painting',type:'influences',weight:'paint & decal'},{id:'flow-5',sourceId:'painting',targetId:'paint-good',type:'increases',weight:'painted output'},
  {id:'flow-6',sourceId:'paint-good',targetId:'assembly',type:'influences',weight:'painted body'},{id:'flow-7',sourceId:'engine-stock',targetId:'engine-line',type:'influences',weight:'engine supply'},{id:'flow-8',sourceId:'engine-line',targetId:'assembly',type:'influences',weight:'engine kit'},{id:'flow-9',sourceId:'assembly',targetId:'assembled-good',type:'increases',weight:'assembled output'},{id:'flow-10',sourceId:'assembled-good',targetId:'quality',type:'influences',weight:'inspect'},
  {id:'flow-11',sourceId:'quality',targetId:'good-units',type:'yes',weight:'GOOD'},{id:'flow-12',sourceId:'quality',targetId:'reject-units',type:'no',weight:'NOT GOOD'},{id:'flow-13',sourceId:'good-units',targetId:'fg-warehouse',type:'increases',weight:'store'},{id:'flow-14',sourceId:'fg-warehouse',targetId:'shipment',type:'increases',weight:'dispatch'},{id:'flow-15',sourceId:'target',targetId:'achievement',type:'influences',weight:'target'}
],[
  {id:'f-body',name:'Good Body Output',nodeId:'body-good',targetNodeId:'body-good',expression:'MIN(Raw_Material_Stock,Daily_Production_Target,Active_Production_Lines*Working_Hours_Day*60/Cycle_Time_Minutes)*Body_Line_Yield/100',inputs:['raw-stock','target','lines','hours','cycle','press-yield']},
  {id:'f-paint',name:'Good Painted Body Output',nodeId:'paint-good',targetNodeId:'paint-good',expression:'MIN(Good_Body_Units,Paint_Decal_Stock)*Paint_Line_Yield/100',inputs:['body-good','paint-stock','paint-yield']},
  {id:'f-assembly',name:'Good Assembly Output',nodeId:'assembled-good',targetNodeId:'assembled-good',expression:'MIN(Good_Painted_Body,Engine_Supply)*Assembly_Yield/100',inputs:['paint-good','engine-stock','assembly-yield']},
  {id:'f-good',name:'Final Good Motorcycles',nodeId:'good-units',targetNodeId:'good-units',expression:'Good_Assembled_Units*Final_Inspection_Yield/100',inputs:['assembled-good','final-yield']},
  {id:'f-reject',name:'Reject and Rework',nodeId:'reject-units',targetNodeId:'reject-units',expression:'Good_Assembled_Units-GOOD_Motorcycles',inputs:['assembled-good','good-units']},
  {id:'f-shipment',name:'Ready for Shipment',nodeId:'shipment',targetNodeId:'shipment',expression:'GOOD_Motorcycles',inputs:['good-units']},
  {id:'f-achievement',name:'Target Achievement',nodeId:'achievement',targetNodeId:'achievement',expression:'GOOD_Motorcycles/Daily_Production_Target*100',inputs:['good-units','target']}
],[
  {id:'normal',name:'Normal Production',overrides:{target:500,lines:4,hours:16,cycle:7.2,'raw-stock':620,'paint-stock':560,'engine-stock':490,'press-yield':97,'paint-yield':95,'assembly-yield':96,'final-yield':98},createdAt:new Date().toISOString()},
  {id:'overtime',name:'Overtime + Extra Supply',overrides:{target:550,lines:4,hours:20,cycle:6.8,'raw-stock':700,'paint-stock':650,'engine-stock':590,'press-yield':98,'paint-yield':97,'assembly-yield':97,'final-yield':99},createdAt:new Date().toISOString()},
  {id:'quality-loss',name:'Quality Problem',overrides:{target:500,lines:4,hours:16,cycle:7.2,'raw-stock':620,'paint-stock':560,'engine-stock':490,'press-yield':91,'paint-yield':86,'assembly-yield':90,'final-yield':92},createdAt:new Date().toISOString()},
  {id:'supply-shortage',name:'Engine Supply Shortage',overrides:{target:500,lines:4,hours:16,cycle:7.2,'raw-stock':620,'paint-stock':560,'engine-stock':310,'press-yield':97,'paint-yield':95,'assembly-yield':96,'final-yield':98},createdAt:new Date().toISOString()}
])

export const templateCatalog=[
  {id:'blank',name:'Blank Universe',description:'Start with an empty canvas.',create:blank},
  {id:'mindmap',name:'Mind Map',description:'Ideas around a central topic.',create:mindmap},
  {id:'hierarchy',name:'Hierarchy Map',description:'Parent, child, and ownership levels.',create:hierarchy},
  {id:'flowchart',name:'Flowchart',description:'Sequential processes and decisions.',create:flowchart},
  {id:'decision',name:'Decision Tree',description:'Yes and No decision paths.',create:decision},
  {id:'fishbone',name:'Fishbone Analysis',description:'6M root-cause analysis.',create:fishbone},
  {id:'causal',name:'Causal Map',description:'Increasing and decreasing influences.',create:causal},
  {id:'kpi',name:'KPI & Formula Model',description:'Measured inputs and calculated outputs.',create:kpi},
  {id:'simulation',name:'Motorcycle Production Simulation',description:'24-node factory model with production lines, GOOD/NOT GOOD, formulas, and ready scenarios.',create:simulation}
]
