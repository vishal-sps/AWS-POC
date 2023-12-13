import { useEffect, useState } from 'react';
import { API, Auth, graphqlOperation } from 'aws-amplify'
import { Button, Flex, TextField, useTheme } from '@aws-amplify/ui-react';
import { createBlog } from '@/src/graphql/mutations';
import { listBlogs } from '@/src/graphql/queries';
import BlogList from './BlogList';


 const Blog = () => {
    const { tokens } = useTheme();
    const [title, setTitle] = useState("")
    const [blogs, setBlogs] = useState([])

    const handleCreateBlog = async(e)=>{
        e.preventDefault();
        const { data } = await API.graphql({
			query: createBlog,
			authMode: "AMAZON_COGNITO_USER_POOLS",
			variables: {
				input: {
					name: title,
				},
			},

		})
        setBlogs([...blogs, data.createBlog])

    }


    useEffect(()=>{
        API.graphql({
            query:listBlogs,
            authMode:"AMAZON_COGNITO_USER_POOLS",
        }).then(({data})=>{
            setBlogs(data?.listBlogs?.items)
        })
    },[])

    return (
       
             <Flex
              direction="column"
              alignItems="flex-start"
              gap={tokens.space.xs}
            >
            <form onSubmit={handleCreateBlog}>
            <TextField placeholder='Create title for blog' value={title} onChange={(e)=>setTitle(e.target.value)} />
            <Button type='submit'> Create Blog</Button>
            </form>

         {blogs?.map((blog)=>{
           return ( <BlogList blog={blog} key={blog?.id}/>
           )
         })}
         </Flex>
       )
 } 

 export default Blog