import { useEffect, useState } from 'react';
import { API, Auth, graphqlOperation } from 'aws-amplify'
import { Button, Flex, TextField, useTheme } from '@aws-amplify/ui-react';
import { createBlog, deleteBlog } from '@/src/graphql/mutations';
import { listBlogs } from '@/src/graphql/queries';
import BlogList from './BlogList';



 const Blog = ({username, isAdmin}) => {
    const { tokens } = useTheme();
    const [title, setTitle] = useState("")
    const [blogs, setBlogs] = useState([])
    const [blogDeleteError, setBlogDeleteError] = useState({id: "", message:""})
    

    const getAllBlog = ()=>{
      API.graphql({
        query:listBlogs,
        authMode:"AMAZON_COGNITO_USER_POOLS",
    }).then(({data})=>{
        setBlogs(data?.listBlogs?.items)

    })

    }
    console.log("Authinfo", username);


    const handleCreateBlog = async(e)=>{
        e.preventDefault();
        const { data } = await API.graphql({
			query: createBlog,
			authMode: "AMAZON_COGNITO_USER_POOLS",
			variables: {
				input: {
					name: title,
          username
				},
			},

		})
        setBlogs([...blogs, data.createBlog])
        setTitle('')

    }

    const handleDeleteBlogPost = async(blogId)=>{
      try {
          const deletePostData = await   API.graphql({
           query:deleteBlog,
           authMode:"AMAZON_COGNITO_USER_POOLS",
           variables:{
            input:{  id:blogId}
           }
       })  
       getAllBlog()
       } catch (error) {
        // errors[0].errorType
           console.log("error", error);
          Array.isArray(error?.errors) && error?.errors[0].errorType === "Unauthorized" && setBlogDeleteError({id: blogId,message:`You are not authorize to delete this blog.`})
       }
  }
  useEffect(()=>{
    if(blogDeleteError.message){
        setTimeout(()=>{
            setBlogDeleteError({id: "", message:""})
        },[2500])
    }
},[blogDeleteError.message])



    useEffect(()=>{
        // API.graphql({
        //     query:listBlogs,
        //     authMode:"AMAZON_COGNITO_USER_POOLS",
        // }).then(({data})=>{
        //     setBlogs(data?.listBlogs?.items)

        // })
        getAllBlog()
    },[])

    return (
       
             <Flex
              direction="column"
              width={'100%'}
              gap={tokens.space.xs}
            >
            <form onSubmit={handleCreateBlog}>
            <Flex
              direction="row"
              alignItems="end"
              gap={tokens.space.xs}
            > <TextField placeholder='Create title for blog' value={title} onChange={(e)=>setTitle(e.target.value)} />
            <Button type='submit'> Create Blog Post</Button>
                </Flex>
           
            </form>

         {blogs?.map((blog)=>{
           return ( <BlogList blog={blog} key={blog?.id} handleDeleteBlogPost={handleDeleteBlogPost} blogDeleteError={blogDeleteError} username={username}/>
           )
         })}
         </Flex>
       )
 } 

 export default Blog