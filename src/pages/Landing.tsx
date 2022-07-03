import React, { useEffect, useState } from 'react';
import { ParticleField } from '../components/canvas-animations/ParticleField';
import { SkeletonText } from '../components/loading/SkeletonText';

//components
import { ULlinkType, ULlinks } from '../components/navigation/ULlinks';

//styling
import '../index.css'

function Landing() {

    const [latestCommit, setLatestCommit] = useState('')
    const [latestCommitUrl, setLatestCommitUrl] = useState('')

    useEffect(() => {
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
                setLatestCommitUrl(json['object']['url'])
            } catch (err) {
                console.warn(err)
            }
        }
        getLatestCommit()
    }, [])

    const links: ULlinkType[] = [
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

    return (
        <>
            <div className='landing-anim'>
                <ParticleField></ParticleField>
            </div>
            <div className='landing'>
                <section>
                    <h4>@jz-dot-meng</h4>
                    <h1>meng<span> :: an online alias for jeff zhang</span></h1>
                    <div>
                        <ULlinks linkMap={links}></ULlinks>
                    </div>
                </section>
                <section>
                    <div>Software developer, occasional sound engineer and music producer</div>
                    <div>Avid home cook, enthusiatic about green/impact investing and other small ways to make a difference</div>
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
