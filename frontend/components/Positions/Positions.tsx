import { useEffect, useState } from "react"
import { ethers } from "ethers"
import contractData from "../../blockchain/ERC1155.json"
import { useWeb3ModalAccount, useWeb3ModalSigner } from "@web3modal/ethers5/react"
import { Button, Group, Image, Modal, TextInput } from "@mantine/core"
import NextImage from 'next/image';
import NFT1 from '../../public/NFT_1.png';
import NFT25 from '../../public/NFT_25.png';
import NFT50 from '../../public/NFT_50.png';
import NFT100 from '../../public/NFT_100.png';
import { useDisclosure } from "@mantine/hooks"
import { IconAddressBook, IconNumber } from "@tabler/icons-react"

const POSITION_NFT_ADDRESS = "0x147E1676e775Aae66ba23D403b1A058efefA027D"


const possibleStakes = [1, 25, 50, 100];
const initialStakes = [0, 0, 0, 0];
const images = [NFT1, NFT25, NFT50, NFT100]

export function Positions() {
    const { signer } = useWeb3ModalSigner();
    const [ stakes, setStakes ] = useState<number[]>(initialStakes);
    const { address } = useWeb3ModalAccount();
    const [opened, { open, close }] = useDisclosure(false);
    const [transferAddr, setTransferAddr] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [transferId, setTransferId] = useState(-1);

    useEffect(() => {
        if (signer === undefined) {
            return;
        }
        async function f() {
            let _stakes:number[] = [];
            try {
                const contract = new ethers.Contract(POSITION_NFT_ADDRESS, contractData.abi, signer);
                for (let i = 0; i < 4; i++) {
                    _stakes.push(await contract.balanceOf(address, possibleStakes[i]));
                }
                console.log("Stakes", _stakes);
                setStakes(_stakes);
            }
            catch (e) {
                console.log(e);
            }
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

    async function transferPosition() {
        console.log("ADDRESS", address)
        try {
            const contract = new ethers.Contract(POSITION_NFT_ADDRESS, contractData.abi, signer);
            await contract.safeTransferFrom(address, address, 1, 1, "");
        }
        catch (e) {
            console.log(e);
        }
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
                        onClick={() => {open(); setTransferId(i);}}
                    >
                        Transfer position
                    </Button>
                </Group>
            ))}
            <Modal opened={opened} onClose={close} centered size="lg">
                <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 'auto', textAlign: 'center'}}>TRANSFER TO</p>
                <TextInput
                    placeholder="Address"
                    inputWrapperOrder={['label', 'error', 'input', 'description']}
                    leftSection={<IconAddressBook size={16} />}
                    size='xl'
                    variant='unstyled'
                    style={{
                        border: '1px solid #E2D04B',
                        width: '70%',
                        margin: 'auto'
                    }}
                    mb={30}
                    onChange={(event) => setTransferAddr(event.target.value)}
                />
                <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 'auto', textAlign: 'center'}}>POSITION AMOUNT</p>
                <TextInput
                    placeholder="Amount"
                    inputWrapperOrder={['label', 'error', 'input', 'description']}
                    leftSection={<IconNumber size={16} />}
                    size='xl'
                    variant='unstyled'
                    style={{
                        border: '1px solid #E2D04B',
                        width: '70%',
                        margin: 'auto'
                    }}
                    mb={30}
                    onChange={(event) => setTransferAmount(event.target.value)}
                />
                <Button onClick={() => transferPosition()} color='#EEAD36' style={{display: 'block', margin: 'auto'}}>Transfer position</Button>
            </Modal>

            <h2 style={{color: '#e77235', fontSize: '50px', textAlign: 'center', margin: 'auto', marginTop: '20px'}}>Total position: {getTotal()}%</h2>
        </Group>
    </>
}