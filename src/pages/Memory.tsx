import { Link } from "react-router-dom"

//styling
import './Memory.css'
type MemoryType = {

}

export const Memory: React.FunctionComponent<MemoryType> = ({ ...props }) => {
    return (
        <>
            <div className='memory-header'>
                <h4><Link to='/'>@jz-dot-meng</Link></h4>
                <h1>memory game<span> :: how far can you get?</span></h1>
            </div>
            <div className='memory-body'>
                {/* <GameTemplate>

                </GameTemplate> */}
            </div>

        </>
    )
}