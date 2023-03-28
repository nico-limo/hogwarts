import {
  ConnectWallet,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useOwnedNFTs,
  Web3Button
} from '@thirdweb-dev/react'
import { useEffect, useState } from 'react'
import './styles/Home.css'

const contractAddress = '0xE31417DE473e1b54319Ad84E709f40e761cf1491'
export default function Home() {
  const { contract } = useContract(contractAddress)
  const address = useAddress()
  const { data: house } = useOwnedNFTs(contract, address)
  const [status, setStatus] = useState<null | boolean>(null)
  const [housePoints, setHousePoints] = useState<{
    [key: number]: string
  }>({
    1: '0',
    2: '0',
    3: '0',
    4: '0'
  })

  useEffect(() => {
    const getPoints = async () => {
      if (house?.length) {
        const pointsG = await contract?.call('teamPoints', '1')
        const pointsH = await contract?.call('teamPoints', '2')
        const pointsR = await contract?.call('teamPoints', '3')
        const pointsS = await contract?.call('teamPoints', '4')
        setHousePoints({
          '1': pointsG.toString(),
          '2': pointsH.toString(),
          '3': pointsR.toString(),
          '4': pointsS.toString()
        })
      }
    }
    getPoints()
  }, [house])

  const [selectedHouseId, setSelectedHouseId] = useState(0)
  console.log({ house, housePoints })
  const houses = [
    { name: 'Gryffindor', id: 1 },
    { name: 'Hufflepuff', id: 2 },
    { name: 'Ravenclaw', id: 3 },
    { name: 'Slytherin', id: 4 }
  ]

  const selectHouse = (id: number) => {
    setSelectedHouseId(id)
  }

  const claimPoints = async () => {
    if (house?.length) {
      await contract?.call('addPoints', Number(house[0].metadata.id), status)
      const pointsG = await contract?.call('teamPoints', '1')
      const pointsH = await contract?.call('teamPoints', '2')
      const pointsR = await contract?.call('teamPoints', '3')
      const pointsS = await contract?.call('teamPoints', '4')
      setHousePoints({
        '1': pointsG.toString(),
        '2': pointsH.toString(),
        '3': pointsR.toString(),
        '4': pointsS.toString()
      })
    }
  }

  return (
    <div className='container'>
      <div className='connect'>
        <ConnectWallet />
      </div>
      <main className='main'>
        <h1>Welcome to Hogwarts</h1>
        {house?.length ? (
          <div className='house'>
            <h3>House Points</h3>
            {houses.map((house) => (
              <div key={house.id}>{`${house.name} with ${
                housePoints[house.id]
              } points`}</div>
            ))}
          </div>
        ) : (
          <div className='house'>
            <h3>Select a House</h3>
            <div className='list'>
              {houses.map((house) => (
                <ul
                  className={selectedHouseId === house.id ? 'selected' : ''}
                  onClick={() => selectHouse(house.id)}
                  key={house.id}
                >
                  {house.name}
                </ul>
              ))}
            </div>
            <Web3Button
              contractAddress={contractAddress}
              action={() =>
                contract?.call('mintTeam', address, selectedHouseId, [])
              }
              isDisabled={selectedHouseId < 1 || selectedHouseId > 4}
            >
              Select
            </Web3Button>
          </div>
        )}
        {house?.length ? (
          <div className='house'>
            <div className='status'></div>
            <ThirdwebNftMedia metadata={house[0].metadata} />
            <div className='quiz'>
              <h4>Wingardium.....?</h4>
              <div className='status'>
                <button
                  style={{ background: status ? 'green' : '' }}
                  onClick={() => setStatus(true)}
                >
                  Leviosa
                </button>
                <button
                  style={{ background: !status ? 'red' : '' }}
                  onClick={() => setStatus(false)}
                >
                  Mimosa
                </button>
              </div>
              <Web3Button
                isDisabled={!status}
                contractAddress={contractAddress}
                action={claimPoints}
              >
                Claim 10 points
              </Web3Button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
