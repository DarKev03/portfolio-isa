import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Title from '../components/Title';
import NavBar from '../components/NavBar';

gsap.registerPlugin(ScrollTrigger);

const AboutMe = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const navBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(imgRef.current, {
                y: 200,
                opacity: 0,
                rotation: 0,

                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=300',
                    scrub: true,
                },
            })
            gsap.to(navBarRef.current, {                
                opacity: 0,                

                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=300',
                    scrub: true,
                },
            })
                ;
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('no-scrollbar');
        return () => root.classList.remove('no-scrollbar');
    }, []);

    return (
        <div className="h-[150vh] bg-[#fffefd] no-scrollbar">

            <div
                ref={sectionRef}
                className="sticky top-0 h-screen w-screen overflow-hidden"
            >

                <div className="fixed inset-0 z-50 pointer-events-none p-8">
                    <Title />
                </div>


                <div ref={navBarRef}
                    className="fixed top-0 right-0 z-50 pt-8">

                    <NavBar />

                    <div className="pr-16">
                        <img
                            ref={imgRef}
                            src="/svgviewer-output.svg"
                            alt=""
                        />
                    </div>

                </div>


                <div className="fixed bottom-0 left-0 z-50 w-140 p-8">

                    <p>
                        Soy Isabel Faubel, diseñadora gráfica.
                        <br />
                        Trabajo desde la idea del diseño como un proceso con
                        intención: un punto de encuentro donde las ideas
                        cobran forma para conectar de manera real con las
                        personas.
                    </p>

                </div>

            </div>

        </div>
    );
};

export default AboutMe;