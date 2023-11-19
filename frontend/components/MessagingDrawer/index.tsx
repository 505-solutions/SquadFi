import React, {useEffect, useCallback} from 'react';
import { Button, Group, Tooltip, Card, Text, Avatar, Stack, Space, TextInput, Form } from '@mantine/core';
import {
    useManageSubscription,
    useSubscription,
    useW3iAccount,
    useInitWeb3InboxClient,
    useMessages
    } from "@web3inbox/widget-react";
  import "@web3inbox/widget-react/dist/compiled.css";
  import { useWeb3ModalSigner, useWeb3ModalAccount } from '@web3modal/ethers5/react'
  import type { Signer } from 'ethers'
  import useSendNotification from "../../hooks/useSendNotification";
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN as string;


export default function MessagingDrawer() {
    const form = useForm({
        initialValues: {
          title: '',
          body: '',
        },
      });      
    const isW3iInitialized = useInitWeb3InboxClient({
        projectId,
        domain: appDomain,
        isLimited: process.env.NODE_ENV == "production",
    });
    const {
        account,
        setAccount,
        register: registerIdentity,
        isRegistered,
        isRegistering,
        identityKey,
      } = useW3iAccount();
    const {subscribe, unsubscribe, isSubscribed, isSubscribing, isUnsubscribing} = useManageSubscription(account);
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { signer } = useWeb3ModalSigner()
    const { handleSendNotification, isSending } = useSendNotification();
    const { messages, deleteMessage } = useMessages(`eip155:${chainId}:${address}`, 'squad-fi.vercel.app')

    const signMessage = useCallback(
        async (message: string) => {
          const res = await signer?.signMessage(message);
          return res as string;
        },
        [signer?.signMessage]
    );

    // We need to set the account as soon as the user is connected
    useEffect(() => {
        if (!Boolean(address)) return;
        setAccount(`eip155:${chainId}:${address}`);
    }, [signMessage, address, setAccount]);

    const handleRegistration = useCallback(async () => {
        if (!account) return;
        try {
          await registerIdentity(signMessage);
        } catch (registerIdentityError) {
          console.error({ registerIdentityError });
        }
      }, [signMessage, registerIdentity, account]);
    
      const handleSubscribe = useCallback(async () => {
        if(!identityKey) {
          await handleRegistration();
          alert('registered')
        }
        await subscribe();
        alert('subscribed')
      }, [subscribe, identityKey])

      const handleUnsubscribe = () => {
        unsubscribe();
        alert('unsubscribed')
      }    
    
      const handleTestNotification = async (values: any) => {


        if (isSubscribed) {      
          handleSendNotification({
            title: values.title,
            body: values.body,
            icon: `https://imagedelivery.net/_aTEfDRm7z3tKgu9JhfeKA/d1ec9032-54e5-4f1c-f67a-51654f6f7900/md`,
            url: window.location.origin,
        // ID retrieved from explorer api - Copy your notification type from WalletConnect Cloud and replace the default value below
            type: "82a411fe-a8ec-4a86-bb0f-693e86cfa105",
          });
        }
      }
      const notification_types = {
            '589a82cc-e31c-4923-9711-b87a6426b11e': 'Alert', // alert
            '82a411fe-a8ec-4a86-bb0f-693e86cfa105': 'Onboarding', // onboarding
            'd035a6b9-e291-41d7-adf0-de94bc3fb7a6': 'Broadcast', // broadcast
            'default': 'Unknown'
      }
      

    return (<>
    <Group >

    {isSubscribed ? (
        <>
            <form style={{width: '100%'}} onSubmit={form.onSubmit((values) => handleTestNotification(values))}>
                <TextInput
                    mt="sm"
                    label='Title'
                    leftSectionPointerEvents="none"
                    placeholder="Pick an important title..."
                    {...form.getInputProps('title')}
                />
                <TextInput
                    mt="sm"
                    label='Message'
                    rightSectionPointerEvents="none"
                    placeholder="...then have something important to say"
                    {...form.getInputProps('body')}
                />
                <Button mt="sm" type='submit' fullWidth loading={isSending}>Broadcast a message to your Squad</Button>
            </form>


            <Button fullWidth 
                    variant='light' 
                    onClick={handleUnsubscribe}
                    loading={isUnsubscribing}
                    loaderProps={{children: "Unsubscribing..."}}>Unsubscribe from messages</Button>
          </>
        ) : (
          <Tooltip
          
            label={
              !Boolean(address)
                ? "Connect your wallet first."
                : "Register your account."
            }
            hidden={Boolean(account)}
          >
            <Button
              fullWidth
              loading={isSubscribing || isRegistering}
              onClick={handleSubscribe}
              variant="outline"
              loaderProps={{children: "Subscribing..."}}
              disabled={!Boolean(address) || !Boolean(account)}
            >
                {!Boolean(address) || !Boolean(account)? "Connecting to wallet..." : "Subscribe to messages"}
            </Button>
          </Tooltip>
        )}

    </Group>

    <ol style={{display: 'none'}}>
        <li>{isConnected? 'connected': 'not'}</li>
        <li>{isRegistered? 'registered': 'not'}</li>
        <li>{isSubscribed? 'subscribed': 'not'}</li>
        <li>{isRegistering? 'is registering': 'not'}</li>
        <li>{isSubscribing? 'is subscribing': 'not'}</li>
        <li>{isUnsubscribing? 'is un-subscribing': 'not'}</li>
    </ol>
    <Space></Space>
    <Stack mt='md' >
    {messages.slice(0).reverse().map((m, index) => {
            return (<Card shadow="sm" padding="xs" radius="sm">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Avatar src={m.message.icon} radius="sm" size="sm" alt="Icon" />
              <div>
                <Text fw={500}>{m.message.title}</Text>
                <Text size="sm">{m.message.body}</Text>
                <Text size="sm" fs='italic' c='dimmed' >{new Date(m.publishedAt).toUTCString()}</Text>

              </div>
            </div>
          </Card>
      )
    })}
    </Stack>



    </>)
}