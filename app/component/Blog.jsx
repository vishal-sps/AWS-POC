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
        setTitle('')

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
           return ( <BlogList blog={blog} key={blog?.id}/>
           )
         })}
         </Flex>
       )
 } 

 export default Blog