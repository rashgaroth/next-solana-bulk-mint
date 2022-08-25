import styled from 'styled-components'

const Counter = styled('div')`
  width: 200px;
  height: 100%;
  padding: 0px;
  display: flex;
  flex-direction: row;
  justify-content: between;
  items-align: center;
  margin-left: 10px;
`

const TriangleLeft = styled('div')`
  display: inline-block;
  height: 0;
  width: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #fba722;
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
    transition: all 0.5s;
  }
`

const TriangleRight = styled('div')`
  display: inline-block;
  height: 0;
  width: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #fba722;
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
    transition: all 0.5s;
  }
`

const CounterInput = styled('input')`
  width: 55px;
  height: 45px;
  font-weight: bold;
  font-size: 1.75rem;
  text-align: center;
  margin: 0px 5px;
  border-radius: 10px;
`

export const MintCounter = ({ mintCount, handleMintCount }: { mintCount: number; handleMintCount: (type: string) => void }) => {
  return (
    <Counter>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TriangleLeft style={{ flexGrow: '1' }} onClick={() => handleMintCount('decrement')} />
      </div>
      <CounterInput type="text" value={mintCount} readOnly />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TriangleRight style={{ flexGrow: '1' }} onClick={() => handleMintCount('increment')} />
      </div>
    </Counter>
  )
}
