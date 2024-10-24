"use client"
import { Heading } from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { formSchema } from "./constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown"

import {
    ChatCompletionMessageParam,
  } from "openai/resources/index.mjs";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

const CodePage = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{prompt: ""}
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionMessageParam = {
                role: "user",
                content: values.prompt
            };
            const newMessages = [...messages, userMessage];

            const response = await axios.post("/api/code", {
                messages: newMessages,
            });

            setMessages((current) => [...current, userMessage, response.data]);
        } catch (error: any) {
            // TODO: Open Pro model
            console.log(error)
        } finally {
            router.refresh();
        }
    }






    return (  
        <div>
            <Heading 
            title="Code"
            description="Generate code"
            icon={Code}
            iconColor="text-green-700"
            bgColor="text-green-700/10"
            />

            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                            <FormField 
                                name="prompt"
                                render={({field}) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input 
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"

                                                disabled={isLoading}
                                                placeholder="Simple toggle button using react hooks."
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}/>
                                <Button className="col-span-12 lg:col-span-2 w-full"
                                disabled={isLoading}>
                                    Generate
                                </Button>

                            
                        </form> 
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center
                        justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    
                    {messages.length === 0 && !isLoading && (
                        <Empty label="No conversation started."/>
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message) => (
                            <div 
                                key={String(message.content)}
                                className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg",
                                    message.role === "user" ?
                                    "bg-white border border-black/10" : "bg-muted"
                                )}
                            >
                                {message.role === "user" ? <UserAvatar/> : <BotAvatar/>}
                                <ReactMarkdown
                                    components={{
                                        pre: ({...props}) => (
                                            <div className=" w-full my-2 bg-black  rounded-lg">
                                                <pre {...props} />
                                            </div>
                                        ),
                                        code({ className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || "");
                                            return match ? (
                                                <SyntaxHighlighter
                                                    language={match[1]}
                                                    PreTag="div"
                                                    className="w-full h-full rounded-lg shadow-md"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, "")}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={`rounded-lg ${className || ""}`} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                    className="text-sm overflow-hidden leading-7"
                                    >
                                    {String(message.content) || ""}       
                                </ReactMarkdown>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default CodePage;