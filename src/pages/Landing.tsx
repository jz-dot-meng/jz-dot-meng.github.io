import React from 'react';
import { ParticleField } from '../components/canvas-animations/ParticleField';

//components
import { ULlinkType, ULlinks } from '../components/navigation/ULlinks';

//styling
import '../index.css'

function Landing() {

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
            </div>
        </>
    );
}

export default Landing;
