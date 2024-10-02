"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import {Loader2} from 'lucide-react'
import axios, { Axios, AxiosError } from 'axios'
import { useEffect, useState } from "react"
import {useDebounceValue} from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SignInSchema } from "@/schemas/SigninSchema"
import UserModel from "@/model/User.model"
import { signIn } from "next-auth/react"

function Page() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {toast} = useToast()
    const router  = useRouter()
    const form = useForm({
        resolver:zodResolver(SignInSchema),
        defaultValues:{
            'identifier':"",
            'password':""
        }
    })
    

    async function onSubmit(data: z.infer<typeof SignInSchema>){
      console.log(data)
        const result = await signIn('credentials', {
          redirect:false,
          identifier:data.identifier, password:data.password
        })
        if(result?.error){
          toast({
            title:'login failed',
            description:"incorrect password or identitfier",
            variant:"destructive"
          })
        }
        if(result?.url){
          router.replace('/dashboard')
        }


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
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username/email</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
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
          SignIn
        </Button>
                    </form>

                </Form>

            </div>
        </div>
        
    )
}

export default Page
