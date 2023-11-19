import { useWeb3ModalSigner } from "@web3modal/ethers5/react";
import contractData from "../../blockchain/SquadFiDeposits.json";
import { useState } from "react";
import { Button, Group, TextInput } from "@mantine/core";
import { IconMapDollar, IconMoneybag, IconNumber0, IconUserDollar } from "@tabler/icons-react";
import { IconSquareNumber8 } from "@tabler/icons-react";
import { ethers } from "ethers";

interface Deposit {
    id: number;
    amount: number;
}


const DEPOSIT_CONTRACT_ADDRESS = "0xFA8166634569537ea716b7350383Ab262335994E";


export function Delegate() {
    const { signer } = useWeb3ModalSigner();
    const [depositAmount, setDepositAmount] = useState<string>('0');
    const [clusterId, setClusterId] = useState<string>('-1');
    const [deposits, setDeposits] = useState<Deposit[]>([]);

    async function addDeposit() {
        try {
            const contract = new ethers.Contract(DEPOSIT_CONTRACT_ADDRESS, contractData.abi, signer);
            await contract.contributeToValidator(clusterId);
        }
        catch (e) {
            console.log(e);
        }
        setDeposits([...deposits, {id: Number(clusterId), amount: Number(depositAmount)}]);
    }
    
    async function removeDeposit(index:number) {
        let _deposits = [];
        for (let i = 0; i < deposits.length; i++) {
            if (i != index) {
                _deposits.push(deposits[i]);
            }
        }
        try {
            const contract = new ethers.Contract(DEPOSIT_CONTRACT_ADDRESS, contractData.abi, signer);
            await contract.cancelContribution(clusterId);
        }
        catch (e) {
            console.log(e);
        }
        setDeposits(_deposits);
    }

    return <>
        <p style={{width: '100%', textAlign: 'center'}}>As opposed to default Obol protocol setting, SquadFi allows you to opt-out of delegation.</p>
        <Group style={{flexDirection: 'row'}}>
            <Group style={{width: '50%', flexDirection: 'column'}}>
                <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 'auto', textAlign: 'center'}}>CLUSTER ID</p>
                <TextInput
                    placeholder="ClusterId"
                    inputWrapperOrder={['label', 'error', 'input', 'description']}
                    leftSection={<IconSquareNumber8 size={16} />}
                    size='xl'
                    variant='unstyled'
                    style={{
                        border: '1px solid #E2D04B',
                        width: '40%',
                        margin: 'auto',
                        height: '60px'
                    }}
                    mb={30}
                    onChange={(event) => setClusterId(event.target.value)}
                />
                <p style={{color: '#E2D04B', fontWeight: 700, alignSelf: "baseline", margin: 'auto', textAlign: 'center'}}>AMOUNT</p>
                <TextInput
                    placeholder="Amount (ETH)"
                    inputWrapperOrder={['label', 'error', 'input', 'description']}
                    leftSection={<IconMoneybag size={16} />}
                    size='xl'
                    variant='unstyled'
                    style={{
                        border: '1px solid #E2D04B',
                        width: '40%',
                        margin: 'auto',
                        height: '60px'
                    }}
                    mb={30}
                    onChange={(event) => setDepositAmount(event.target.value)}
                />
                <Button onClick={() => addDeposit()} color='#EEAD36' style={{display: 'block', margin: 'auto'}} size="lg">Make deposit</Button>
            </Group>
            <Group style={{flexDirection: 'column'}}>
                { deposits.map((deposit, i) => (
                    <Group style={{flexDirection: 'column'}}>
                        <Group>
                            <IconUserDollar color='#E2D04B'/>
                            <p style={{color: '#E2D04B', fontWeight: 500, alignSelf: "baseline", textAlign: 'center', fontSize: '30px'}}>Deposit:</p>
                            <p style={{color: '#E2D04B', fontWeight: 500, alignSelf: "baseline", textAlign: 'center', fontSize: '30px'}}>Cluster{deposit.id}</p>
                            <p style={{color: '#E2D04B', fontWeight: 500, alignSelf: "baseline", textAlign: 'center', fontSize: '30px'}}>{deposit.amount}ETH</p>
                            <Button onClick={() => removeDeposit(i)} color='#EEAD36' style={{display: 'block', margin: 'auto'}} size="m">Remove deposit</Button>
                        </Group>
                    </Group>
                )) }
            </Group>
        </Group>
    </>;
}
