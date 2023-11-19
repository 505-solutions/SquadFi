import { useEffect, useState } from "react"
import { ethers } from "ethers"
import contractData from "../../blockchain/ERC1155.json"
import { useWeb3ModalAccount, useWeb3ModalSigner } from "@web3modal/ethers5/react"
import { Button, Group, Image } from "@mantine/core"
import NextImage from 'next/image';
import NFT1 from '../../public/NFT_1.png';
import NFT25 from '../../public/NFT_25.png';
import NFT50 from '../../public/NFT_50.png';
import NFT100 from '../../public/NFT_100.png';

const POSITION_NFT_ADDRESS = "0x3af4FF5D422f28737466c8Ca7084FC8A69A6cEbf"


const possibleStakes = [1, 25, 50, 100];
const initialStakes = [0, 0, 0, 0];
const images = [NFT1, NFT25, NFT50, NFT100]

export function Positions() {
    const { signer } = useWeb3ModalSigner();
    const [ stakes, setStakes ] = useState<number[]>(initialStakes);
    const { address } = useWeb3ModalAccount();

    useEffect(() => {
        if (signer === undefined) {
            return;
        }
        async function f() {
            let _stakes:number[] = [];
            const contract = new ethers.Contract(POSITION_NFT_ADDRESS, contractData.abi, signer);            
            for (let i = 0; i < 4; i++) {
                _stakes.push(await contract.balanceOf("0xFA8166634569537ea716b7350383Ab262335994E", possibleStakes[i]));
            }
            console.log("Stakes", _stakes);
            setStakes(_stakes);
        }
        f();
    }, [address])

    function getTotal() {
        let total = 0
        for (let i = 0; i < 4; i++) {
            total += stakes[i] * possibleStakes[i];
        }
        return total;
    }
    
    return <>
        <Group style={{flexDirection: 'row', justifyContent: 'space-between'}} mt={40}>
            { stakes.map((stake, i) => (
                <Group key={i} style={{flexDirection: 'column', width: '20%', alignItems: 'center'}}>
                    <h2 style={{color: '#e77235', fontSize: '40px', margin: 0}}>{stake.toString()}x</h2>
                    <Image
                        radius="md"
                        component={NextImage}
                        alt='Cats'
                        src={images[i]}
                        style={{width: '80%', margin: 'auto', height: 'auto'}}
                    />
                    <h2 style={{color: '#e77235', fontSize: '40px', margin: 0}}>{Number(stake) * possibleStakes[i]}%</h2>
                    <Button 
                        variant="gradient"
                        gradient={{ from: '#EEAD36', to: '#E97333', deg: 90 }}
                    >
                        Transfer position
                    </Button>
                </Group>
            ))}

            <h2 style={{color: '#e77235', fontSize: '50px', textAlign: 'center', margin: 'auto', marginTop: '20px'}}>Total position: {getTotal()}%</h2>
        </Group>
    </>
}