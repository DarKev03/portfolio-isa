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
    const titleRef = useRef<HTMLDivElement>(null);
    const titleContentRef = useRef<HTMLDivElement>(null);
    const parentesisRef = useRef<HTMLDivElement>(null);
    const bioRef = useRef<HTMLDivElement>(null);

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
            gsap.to(titleRef.current, {
                opacity: 0,

                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=300',
                    scrub: true,
                },
            })
            gsap.to(parentesisRef.current, {
                opacity: 1,

                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=300',
                    scrub: true,
                },
            })
            gsap.to(bioRef.current, {
                y: () => {
                    const titleRect =
                        titleContentRef.current!.getBoundingClientRect();

                    const bioRect =
                        bioRef.current!.getBoundingClientRect();

                    return titleRect.bottom - bioRect.top;
                },

                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=300',
                    scrub: true,
                    invalidateOnRefresh: true,
                },
            });
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
                className="sticky top-0 h-screen w-screen overflow-hidden text-[#414141]"
            >

                <div
                    ref={titleRef}
                    className="fixed inset-0 z-50 pointer-events-none p-8"
                >
                    <div ref={titleContentRef}>
                        <Title />
                    </div>
                </div>

                <div
                    ref={parentesisRef}
                    className="fixed inset-0 z-50 pointer-events-none p-8 opacity-0">
                    <h1 className="text-lg italic font-normal" style={{ fontFamily: 'Castoro, sans-serif' }}>
                        ()
                    </h1>
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


                <div ref={bioRef} className="absolute bottom-0 left-0 z-50 w-140 p-8 text-lg leading-tight" style={{ fontFamily: 'Castoro, sans-serif' }}>

                    <p>
                        Soy Isabel Faubel, diseñadora gráfica.
                        <br />
                        Trabajo desde la idea del diseño como un proceso con intención:
                        <br></br>
                        un punto de encuentro donde las ideas cobran forma para conectar de
                        manera real con las personas. Me apasiona cuidar esos pequeños
                        detalles que marcan la diferencia y hacen que un proyecto no solo
                        funcione, sino que tenga un valor real. Disfruto explorando cada
                        etapa del proceso creativo y viendo hasta dónde pueden llegar las
                        ideas. Para mí, la visión global de un proyecto es fundamental.
                        Por eso, me gusta abordar mi trabajo desde una perspectiva multidisciplinar.
                    </p>

                </div>

                <div className="absolute bottom-0 left-0 z-50 w-140 p-8 flex flex-col gap-7" style={{ fontFamily: 'Castoro, sans-serif' }}>
                    <div>
                        <h1 className="text-lg font-normal leading-tight">Grado en Diseño Gráfico / <br></br>
                            <span className="italic">Escola Superior de Disseny de Valéncia</span> </h1>
                        <p className="text-sm text-[#414141]">
                            Septiembre 2022 - Junio 2026
                        </p>
                    </div>

                    <div>
                        <h1 className="text-lg font-normal leading-tight">Diseñadora Gráfica (Prácticas Curriculares) / <br></br>
                            <span className="italic">Samaruc Estudio</span></h1>
                        <p className="text-sm">
                            Febrero 2026 - Abril 2026
                        </p>
                    </div>

                    <div>

                    </div>
                </div>

            </div>

        </div>
    );
};

export default AboutMe;