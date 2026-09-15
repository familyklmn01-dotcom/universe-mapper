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
const simulation=()=>{const data=kpi();data.universe.name='Business Simulation';data.universe.description='Run formula outcomes under alternative scenarios.';data.scenarios=[{id:'growth',name:'Growth Scenario',overrides:{sales:130,quality:88},createdAt:new Date().toISOString()},{id:'pressure',name:'Pressure Scenario',overrides:{sales:80,quality:72},createdAt:new Date().toISOString()}];return data}

export const templateCatalog=[
  {id:'blank',name:'Blank Universe',description:'Start with an empty canvas.',create:blank},
  {id:'mindmap',name:'Mind Map',description:'Ideas around a central topic.',create:mindmap},
  {id:'hierarchy',name:'Hierarchy Map',description:'Parent, child, and ownership levels.',create:hierarchy},
  {id:'flowchart',name:'Flowchart',description:'Sequential processes and decisions.',create:flowchart},
  {id:'decision',name:'Decision Tree',description:'Yes and No decision paths.',create:decision},
  {id:'fishbone',name:'Fishbone Analysis',description:'6M root-cause analysis.',create:fishbone},
  {id:'causal',name:'Causal Map',description:'Increasing and decreasing influences.',create:causal},
  {id:'kpi',name:'KPI & Formula Model',description:'Measured inputs and calculated outputs.',create:kpi},
  {id:'simulation',name:'Business Simulation',description:'Formula model with ready scenarios.',create:simulation}
]
