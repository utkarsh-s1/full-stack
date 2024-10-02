"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import {Loader2} from 'lucide-react'
import axios, { Axios, AxiosError } from 'axios'
import { useEffect, useState } from "react"
import {useDebounceValue, useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function Page() {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isChecking, setIsChecking] = useState(false)
    const debouncedUsername = useDebounceCallback(setUsername, 300)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {toast} = useToast()
    const router  = useRouter()
    const form = useForm({
        resolver:zodResolver(signUpSchema),
        defaultValues:{
            'username':"",
            'email':'',
            'password':""
        }
    })
    useEffect(()=>{
        const checkusername = async()=>{
            if(username){
                setIsChecking(true)
                setUsernameMessage("")
                try {
                    const isUnqiue = await axios.get(`/api/check-username?username=${username}`)
                    setUsernameMessage(isUnqiue.data.message)

                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message || "Error while chekcing unique username")
                    
                }finally{
                    setIsChecking(false)
                }
            }
        }
        checkusername()
    }
    ,[username])

    async function onSubmit(data: z.infer<typeof signUpSchema>){
        setIsSubmitting(true)
        try {
            const resp = await axios.post('api/sign-up', data)

            toast({
                'title':'Success',
                description:resp.data.message,

            })
            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        } catch (error) {
            console.log('error in signup',error)

        }
        setIsSubmitting(false)


    }



    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full p-8 max-w-md space-y-8 bg-white rounded-md shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Join Mystery MEssage
                    </h1>
                    <p className="mb-4">
                        Join to start yyour journey of anonymous messages
                    </p>

                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} onChange={(e)=>{
                    field.onChange(e)
                    debouncedUsername(e.target.value)

                }} />

              </FormControl>
              <p>
                {usernameMessage}
              </p>
              {isChecking&&
                <Loader2 className="animate-spin"/>
              }
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder="password" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting?(
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait
              </>
            )
            :(
              'SignUp'
            )
          }
          
        </Button>
                    </form>

                </Form>

            </div>
        </div>
        
    )
}

export default Page
