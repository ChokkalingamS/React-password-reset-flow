import './App.css';
import {useState,useContext,createContext} from 'react'
import {useHistory,Route,Switch,useParams } from 'react-router-dom'



export default  function App() {
  return (
    <div className="App">
      <Password/>
    </div>
  );
}

const URL='http://localhost:2000/users';
const context=createContext('')
function Password()
{
  const[Firstname,setFirstname]=useState('');
  const[Lastname,setLastname]=useState('');
  const[Mailid,setMailid]=useState('');
  const[Password,setPassword]=useState('');
  let history=useHistory();
  const obj={Firstname,setFirstname,Mailid,Lastname,setLastname,setMailid,Password,setPassword,history}
  return(<div className="container">
      <context.Provider value={obj}>
      <Switch>
        <Route exact path='/'><Signup/></Route>
        <Route exact path='/login'><Login/></Route>
        <Route exact path='/Dashboard'><Dashboard/></Route>
        <Route exact path='/forgotpassword'><Forgotpassword/></Route>
        <Route path='/updatepassword'><Message/></Route>
        <Route path='/forgotpassword/verify/:id'><Redirect/></Route>
        <Route path='/newpassword/:id'><Newpassword/></Route>
        <Route path='/final'><Endpage/></Route>
        <Route path="**">NOT FOUND</Route>
        </Switch>
        </context.Provider>
  </div>)
}


function Signup()
{

  const {Firstname,setFirstname,Lastname,setLastname,Mailid,setMailid,Password,setPassword,history}=useContext(context)
  const userdata={Firstname,Lastname,Mailid,Password};
  // console.log(userdata);


  const signUp = async (userdata) => {
    const signupresponse = await fetch(`${URL}/signup`, {
      method: "POST",
      body: JSON.stringify(userdata),
      headers: { "Content-Type": "application/json" },
    });
    const data=await signupresponse.json()
    console.log(data);  
    return signupresponse.status
  };
  
 
 
  return (
    <div>
      <input type="text" onInput={(e)=>setFirstname(e.target.value)} placeholder="Enter The Firstname" />
      <input type="text" onInput={(e)=>setLastname(e.target.value)} placeholder="Enter The  Lastname" />
      <input type="text" onInput={(e)=>setMailid(e.target.value)} placeholder="Enter The Mailid" />
      <input type="text" onInput={(e)=>setPassword(e.target.value)} placeholder="Enter The Password" />
      <button type="submit" onClick={()=>signUp(userdata).then((x)=>(x===200)&&history.push('/login'))}>Get Started</button>
      <button type="submit" onClick={()=>history.push('/login')}>Login</button>
      
     
    </div>
  );
}


function Login()
{
  
  const {Mailid,setMailid,Password,setPassword,history}=useContext(context)
  const userdata={Mailid,Password};

  const logIn = async (userdata) => {
    const loginresponse = await fetch(`${URL}/login`, {
      method: "POST",
      body: JSON.stringify(userdata),
      headers:{'Content-Type': 'application/json'},
    });
    const data=await loginresponse.json()
    console.log(data);
    return loginresponse.status
  };

  return(<div>
      <input type="text" onInput={(e)=>setMailid(e.target.value)} placeholder="Enter The Mailid" />
      <input type="text" onInput={(e)=>setPassword(e.target.value)} placeholder="Enter The Password" />
      <button type="submit" onClick={()=>logIn(userdata).then((x)=>(x===200)&&history.push('/dashboard'))}>Login</button>
      <button type="submit" onClick={()=>history.push('/forgotpassword')}>Forgot Password</button>

  </div>)
}















function Forgotpassword()
{
  const {Mailid,setMailid,history}=useContext(context)

  const userdata={Mailid}
 
  const forgot=async(userdata)=>{
    const forgotresponse=await fetch(`${URL}/forgotpassword`,
    {
      method:"POST",
      body:JSON.stringify(userdata),
      headers:{'Content-Type':'application/json'}
    })
  return  forgotresponse.status
  }

  return(<div>
    <input type="text" onInput={(e)=>setMailid(e.target.value)} placeholder="Enter The Mailid" />
    <button type="submit" onClick={()=>{forgot(userdata).then((x)=>(x===200)&&history.push('/updatepassword'))}}>Submit</button>
  </div>)
}


function Message()
{
  return (<div>Link sent to the mail</div>)
}


function Redirect()
{
  const {id}=useParams()
  
  
  return ((id)?<Updatepassword id={id}/>:null)
}

function Updatepassword({ id }) {
  const { history } = useContext(context);
 const Result = (id) => {
    fetch(`${URL}/forgotpassword/verify`, {
      method: "GET",
      headers: { "x-auth-token": id },
    })
      .then((response) => response.status)
      .then((status) =>
        status === 200 ? history.push(`/newpassword/${id}`) : null
      );
  };

  Result(id);

  return <div>Loading...</div>;
}

function Newpassword()
{
  let {id}=useParams()
  const {history}=useContext(context)
  const {Password,setPassword}=useContext(context)
  const userdata={Password,token:id};
  console.log(userdata);
  const Changepassword=(userdata)=>{
     fetch(`${URL}/updatepassword`,
    {
      method:"POST",
      body  :JSON.stringify(userdata),
      headers:{"Content-Type":"application/json"}
    }).then((response)=>response.status).then((status)=>(status===200)?history.push('/final'):null)
    // const result=await passwordchangeresponse.json();
    // console.log(result.status);
    // const page=(passwordchangeresponse.status===200)?history.push('/final'):null
    
  }
 
  
  return (<div>
    <input type="text" onInput={(e)=>setPassword(e.target.value)} placeholder="Enter The Password" />
    <button type="submit" onClick={()=>Changepassword(userdata)}>Update Password</button>
  </div>) 
}


function Endpage()
{
  return <p>Password Changed Successfully</p>
}



function Dashboard()
{
 return <div>Dashboard</div>  
}


