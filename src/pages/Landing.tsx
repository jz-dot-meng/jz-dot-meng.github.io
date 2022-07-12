import React, { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ParticleField } from '../components/canvas-animations/ParticleField';
import { SkeletonText } from '../components/loading/SkeletonText';

//components
import { ULHorizontalLinkType, ULHorizontalLinks } from '../components/navigation/ULlinks';

//styling
import './Landing.css'
import '../index.css'
import { CliffordAttractor } from '../components/canvas-animations/CliffordAttractor';
import { LeftRightSelect } from '../components/common/selections/LeftRightSelect';

function Landing() {

    const animations = [
        'Particle field',
        'Clifford Attractor'
    ]

    const [latestCommit, setLatestCommit] = useState<string>('')

    const [selectedAnim, setSelectedAnim] = useState<number>(0)
    const [component, setComponent] = useState<ReactNode | null>(null)

    const [dynamicFade, setDynamicFade] = useState<string>('')

    /**
     * On initial load
     */
    useEffect(() => {
        /**
         * Get github latest branch commit to jz-dot-meng.github.io 
         */
        async function getLatestCommit() {
            try {
                const response = await fetch('https://api.github.com/repos/jz-dot-meng/jz-dot-meng.github.io/git/refs/heads/main', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const json = await response.json();
                let shaSlice = json['object']['sha'].slice(0, 6)
                setLatestCommit(shaSlice);
            } catch (err) {
                console.warn(err)
            }
        }
        getLatestCommit()
        setTimeout(() => setDynamicFade('fadeout-5sec'), 1000)
    }, [])

    useEffect(() => {
        switch (selectedAnim) {
            case 0:
                setComponent(<ParticleField />)
                break;
            case 1:
            default:
                setComponent(<CliffordAttractor />);
        }
    }, [selectedAnim])


    const links: ULHorizontalLinkType[] = [
        {
            url: 'https://www.linkedin.com/in/jeffrey-zhang-133221196/',
            name: 'LinkedIn'
        },
        {
            url: 'https://github.com/jz-dot-meng',
            name: 'Github'
        },
        {
            url: 'https://www.instagram.com/meng_beats/',
            name: 'Instagram'
        }
    ]

    const handleSelectionChange = (newSelection: number) => {
        setSelectedAnim(newSelection);
    }

    /**
     * Handle mouse over canvas, show selection tool
     */
    const handleMouseOverDisplay = () => {
        setDynamicFade('')
    }
    /**
     * Handle mouse leave canvas, fade out selection tool
     */
    const handleMouseLeaveFade = () => {
        setDynamicFade('fadeout-5sec')
    }

    return (
        <>
            <div className='landing-anim' onMouseOver={handleMouseOverDisplay} onMouseLeave={handleMouseLeaveFade}>
                {component}
                <div className={`landing-anim-selector ${dynamicFade}`}>
                    <LeftRightSelect options={animations} selection={selectedAnim} onChange={handleSelectionChange} />
                </div>
            </div>
            <div className='landing'>
                <section>
                    <h4>@jz-dot-meng</h4>
                    <h1>meng<span> :: an online alias for jeff zhang</span></h1>
                    <div>
                        <ULHorizontalLinks linkMap={links}></ULHorizontalLinks>
                    </div>
                </section>
                <section>
                    <div><Link to='/stroop'>Software developer</Link>, occasional sound engineer and music producer</div>
                    <div>Avid home cook, enthusiatic about green/impact investing, <Link to='/WalletBalance'>personal finance</Link> and other small ways to make a difference</div>
                </section>
                <section className='landing-footer'>
                    <div>{latestCommit ?
                        <a href='https://github.com/jz-dot-meng/jz-dot-meng.github.io'>
                            {latestCommit}
                        </a> :
                        <SkeletonText textLength={7} href='https://github.com/jz-dot-meng/jz-dot-meng.github.io' />
                    }<span> :: check out the latest branch commit </span></div>
                </section>
            </div>
        </>
    );
}

export default Landing;
