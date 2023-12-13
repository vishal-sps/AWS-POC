import { createPost, deletePost } from '@/src/graphql/mutations';
import { getPost, listPosts } from '@/src/graphql/queries';
import {
    Card,
    Image,
    View,
    Heading,
    Flex,
    Badge,
    Text,
    Button,
    useTheme,
    TextField,
    Alert
  } from '@aws-amplify/ui-react';
import { API } from 'aws-amplify';
import { useEffect, useState } from 'react';
import PostList from './PostList';
  
const BlogList = ({blog}) => {
    console.log("blog", blog);
    const { tokens } = useTheme();

    const [postTitle, setPostTitle] = useState("")
    const [posts, setPosts] = useState([])
    const [error, setError] = useState("")

    const handleCreatePost = async(e)=>{
        e.preventDefault();
        const { data } = await API.graphql({
			query: createPost,
			authMode: "AMAZON_COGNITO_USER_POOLS",
			variables: {
				input: {
                    blogPostsId: blog?.id,
					title: postTitle,
				},
			},

		})
        setPosts([...posts, data.createPost])

    }

    const handleDeletePost = async(postId)=>{
        console.log("deleteting...");
    

        try {
           const deletePostData = await   API.graphql({
            query:deletePost,
            authMode:"AMAZON_COGNITO_USER_POOLS",
            variables:{
             input:{  id:postId}
            }
        })
        getAllPost()
        // console.log("deletePostData",deletePostData);

        } catch (error) {
            console.log("error", );
           Array.isArray(error?.errors) && setError(`${error?.errors[0].message}`)
        }
    }

    const getAllPost = ()=>{
        try {
            API.graphql({
                query:listPosts,
                authMode:"AMAZON_COGNITO_USER_POOLS",
                variables:{
                    filter: {blogPostsId: {eq: blog?.id}}
                }
            }).then(({data})=>{
                setPosts(data?.listPosts?.items)
            })
        } catch (error) {
            console.log("error", error);
        }
    }

    useEffect(()=>{
       getAllPost()
    },[])

    return (
      <View
        backgroundColor={tokens.colors.background.secondary}
        padding={tokens.space.medium}
      >
       {error ?  <Alert variation="error" isDismissible={true}>{error}</Alert> : "" } 
        <Card>
            
            <Flex
              direction="column"
              alignItems="flex-start"
              gap={tokens.space.xs}
            >
              
  
              <Heading level={5}>
               {blog?.name}
              </Heading>

              <View
        backgroundColor={tokens.colors.background.secondary}
        padding={tokens.space.medium}
      >
            <form onSubmit={handleCreatePost}>
            <TextField placeholder='Create title for post' value={postTitle} onChange={(e)=>setPostTitle(e.target.value)} />
            <Button  variation="primary" type='submit'> Create Post</Button>
            </form>
            </View>

           {
            posts?.map((post)=>{
                return (         
                    <PostList post={post} key={post?.id} handleDeletePost={handleDeletePost} />
                )
            })
           }


  
            </Flex>
        </Card>
      </View>
    );
  };

  export default BlogList