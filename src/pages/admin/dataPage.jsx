import { useEffect, useState } from 'react'
import {Tabs,Tab,Table, Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { adminGetCollections, adminGetExhibitions, adminGetUsers, adminGetVideos, adminPatchUsers } from '../../api/admin'

function TableHead({tableHeader}){
  return(
    <thead  >
        <tr >
          <th className='bg-dark text-white' scope='col'>#</th>
          <th className='bg-dark text-white' scope='col'>Name</th>
          <th className='bg-dark text-white' scope='col'>{tableHeader}</th>
          <th className='bg-dark text-white' scope='col'></th>
        </tr>
      </thead>
  )
}
function TableContent({id,name,dataList,content,isAdmin,onLinkClick}){
  const lastColumn=(isAdmin)=>{
     if(dataList==='users'){
      return (
        <Link to='/admin/collections' onClick={()=>onLinkClick?.({id,isAdmin})}>{isAdmin?'set as user':'set as Admin'}</Link>
      )
    }else if(dataList==='videos'){
      return
    }else{
      return(
        <>
          <Button variant='success' className='mr-2' href=''>edit</Button>{' '}
          <Button variant='secondary' href=''>show</Button>{' '}
          <Button variant='danger' href=''>delete</Button>
        </> 
      )
    }
  }
  return (
    <tbody>
        {
        
          <tr key={id}>
          <th scope='row'>{id}</th>
          <td>{name}</td>
          <td>{content}</td>
          <td>
            {
             lastColumn(isAdmin)
            }
          </td>
        </tr>
        
        }
        
      </tbody>
  )
}



 function DataPage(){
  const [key,setKey]=useState('User')
  const [users,setUsers]=useState([])
  const [collections,setCollecions]=useState([])
  const [exhibitions,setExhibitions]=useState([])
  const [videos,setVideos]=useState([])

  const handlePatchUser=async({id,isAdmin})=>{
    await adminPatchUsers({id,isAdmin})
    setUsers((prevUsers)=>{
     return prevUsers.map(user=>{
        if(user.id===id){
          return{
            ...user,
            isAdmin:!user.isAdmin
          }
        }
        return user
      })
    })
  }

  useEffect(()=>{
     const getUsersAsync=async()=>{
      try{
        const users=await adminGetUsers()
        setUsers(users.map(user=>({...user})))
      }catch(err){
        console.error(err)
      } 
  }
    const getColllectionsAsync=async()=>{
      try{
        const collections=await adminGetCollections()
        setCollecions(collections.map(collection=>({...collection})))
      }catch(err){
        console.error(err)
      } 
  }
    const getExhibtionsAsync=async()=>{
      try{
        const exhibitions=await adminGetExhibitions()
        setExhibitions(exhibitions.map(exhibition=>({...exhibition})))
      }catch(err){
        console.error(err)
      } 
  }
    const getVideosAsync=async()=>{
      try{
        const videos=await adminGetVideos()
        setVideos(videos.map(video=>({...video})))
      }catch(err){
        console.error(err)
      }
  }

  getUsersAsync()
  getColllectionsAsync()
  getExhibtionsAsync()
  getVideosAsync()
  },[])
 
  return(
    <>
    <h1>後台</h1>
    
    <Tabs
      activeKey={key}
      onSelect={k=>setKey(k)}
      className='mb-3'
    >
      <Tab eventKey="User" title="User">
            <Table hover>
            <TableHead
            tableHeader='Email'
            />
            {
              users.map(user=>
                <TableContent
                key={user.id}
                id={user.id}
                name={user.name}
                content={user.email}
                isAdmin={user.isAdmin}
                dataList='users'
                onLinkClick={handlePatchUser}
                />
                )
            }           
          </Table>
      </Tab>
      <Tab eventKey="Collection" title="Collection">
        <Button href='/admin/collections/create' className='mb-5'>Create Collection</Button>
          <Table hover>
            <TableHead tableHeader='Category'/>
            {
              collections.map(collection=>
                <TableContent
                key={collection.id}
                id={collection.id}
                name={collection.name}
                content={collection.category}
                isAdmin=''
                dataList='collections'
                />
                )
            }
          </Table>
      </Tab>
      <Tab eventKey="Exhibition" title="Exhibition">
        <Button href='' className='mb-5'>Create Exhibition</Button>
        <Table hover>
            <TableHead
            tableHeader='Fare'
            />
            {
              exhibitions.map(exhibition=>
                <TableContent
                key={exhibition.id}
                id={exhibition.id}
                name={exhibition.name}
                content={exhibition.fare}
                isAdmin=''
                dataList='exhibitions'
                />
                )
            }           
          </Table>
      </Tab>
      <Tab eventKey="Video" title="Video">
        <Table hover>
            <TableHead
            tableHeader='Issue Date'
            />
            {
              videos.map(video=>
                <TableContent
                key={video}
                id={video.id}
                name={video.name}
                content={video.issueDate}
                isAdmin=''
                dataList='videos'
                />
                )
            }           
          </Table>
      </Tab>
    </Tabs>
    </>
  )
}

export default DataPage