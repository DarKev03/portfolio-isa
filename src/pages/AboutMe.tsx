import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import gsap from 'gsap';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Title from '../components/Title';

import NavBar from '../components/NavBar';
import CvDownload from '../components/CvDownload';
import { useLanguage } from '../i18n/languageContext';
import { Link } from 'react-router-dom';
import { BLOCKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useAbout } from '../contentful/useAbout';
import { readImage } from '../contentful/projects';
import { useTranslation } from '../i18n/translations';
import { useReducedMotion } from '../components/useReducedMotion';


gsap.registerPlugin(ScrollTrigger);


const AboutMe = () => {

    const { language } = useLanguage();
    const text = useTranslation();
    const reducedMotion = useReducedMotion();
    const aboutState = useAbout();
    const aboutContent = aboutState.status === 'ready' ? aboutState.content : null;
    const [firstPhoto, secondPhoto] = aboutContent?.photos ?? [];
    const [needsFlowLayout, setNeedsFlowLayout] = useState(false);
    const usesFlowLayout = reducedMotion || needsFlowLayout;
    const longContentWidth = firstPhoto ? 'max-w-[calc(100%-min(168px,30vw)-32px)]' : 'max-w-full';
    const sectionRef = useRef<HTMLDivElement>(null);

    const img2Ref = useRef<HTMLImageElement>(null);

    const navBarRef = useRef<HTMLDivElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const titleRef = useRef<HTMLDivElement>(null);
    const titleContentRef = useRef<HTMLDivElement>(null);

    const parentesisRef = useRef<HTMLDivElement>(null);

    const bioRef = useRef<HTMLDivElement>(null);
    const cvRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const bio = bioRef.current;
        const cv = cvRef.current;
        const footer = footerRef.current;
        const title = titleContentRef.current;
        if (!bio || !cv || !footer || !title) return;

        const updateLayout = () => {
            const bioStyle = getComputedStyle(bio);
            // Compare the same padding in both layouts to avoid switching back and forth.
            const bioHeight = bio.offsetHeight - parseFloat(bioStyle.paddingTop) + parseFloat(bioStyle.paddingBottom);
            setNeedsFlowLayout(
                window.innerWidth < 768 ||
                title.getBoundingClientRect().bottom + bioHeight + cv.offsetHeight + footer.offsetHeight > window.innerHeight,
            );
        };

        let refreshFrame = 0;
        const observer = new ResizeObserver(() => {
            updateLayout();
            cancelAnimationFrame(refreshFrame);
            refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
        });
        [bio, cv, footer, title].forEach(element => observer.observe(element));
        window.addEventListener('resize', updateLayout);
        updateLayout();

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateLayout);
            cancelAnimationFrame(refreshFrame);
        };
    }, []);


    useEffect(() => {

        const ctx = gsap.context(() => {
            const navBar = navBarRef.current;
            const imageContainer = imageContainerRef.current;

            if (!navBar || !imageContainer) return;

            if (reducedMotion) {
                const positionPhoto = () => gsap.set(imageContainer, {
                    opacity: 1,
                    y: navBar.getBoundingClientRect().bottom + 20,
                });
                positionPhoto();
                window.addEventListener('resize', positionPhoto);
                return () => window.removeEventListener('resize', positionPhoto);
            }

            gsap.set(imageContainer, {
                opacity: 1,
            });

            const photoTimeline = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'max',
                    scrub: true,
                    invalidateOnRefresh: true,
                },
            });
            photoTimeline.fromTo(
                imageContainer,
                { y: () => navBar.getBoundingClientRect().bottom + 20 },
                { y: () => window.innerHeight - imageContainer.offsetHeight },
                0,
            );

            if (img2Ref.current) {
                photoTimeline.to(img2Ref.current, { opacity: 1 }, 0);
            }


            /*
             * Navbar desaparece con el scroll.
             */
            gsap.to(navBarRef.current, {

                opacity: 0,

                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=300',
                    scrub: true,
                },

            });


            /*
             * Title desaparece con el scroll.
             */
            gsap.to(titleRef.current, {

                opacity: 0,

                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=300',
                    scrub: true,
                },

            });


            /*
             * Paréntesis aparecen con el scroll.
             */
            gsap.to(parentesisRef.current, {

                opacity: 1,

                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=300',
                    scrub: true,
                },

            });


            if (!usesFlowLayout) {
                /*
                 * Bio.
                 */
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


                /*
                 * Footer.
                 */
                gsap.to(footerRef.current, {

                    opacity: 1,

                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: '+=300',
                        scrub: true,
                        invalidateOnRefresh: true,
                    },

                });


                /*
                 * CV.
                 */
                gsap.to(cvRef.current, {

                    opacity: 1,

                    y: () => {

                        const bioRect =
                            bioRef.current!.getBoundingClientRect();

                        const cvRect =
                            cvRef.current!.getBoundingClientRect();

                        const titleRect =
                            titleContentRef.current!.getBoundingClientRect();

                        return (
                            (titleRect.bottom - bioRect.top) +
                            (bioRect.bottom - cvRect.top)
                        );
                    },

                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: '+=300',
                        scrub: true,
                        invalidateOnRefresh: true,
                    },

                });
            }

        }, sectionRef);


        ScrollTrigger.refresh();
        return () => ctx.revert();

    }, [aboutContent, aboutState.status, usesFlowLayout, reducedMotion]);


    useEffect(() => {

        const root = document.documentElement;

        root.classList.add('no-scrollbar');

        return () => root.classList.remove('no-scrollbar');

    }, []);


    return (

        <div className={`${reducedMotion ? 'min-h-screen' : usesFlowLayout ? 'min-h-[150vh]' : 'h-[150vh]'} bg-[#fffefd] no-scrollbar`}>

            <div
                ref={sectionRef}
                className={`${usesFlowLayout ? `relative flex ${reducedMotion ? 'min-h-screen' : 'min-h-[150vh]'} w-full flex-col` : 'sticky top-0 h-screen w-screen overflow-hidden'} text-[#414141]`}
            >

                {/* TITLE */}

                <div
                    ref={titleRef}
                    className="fixed inset-0 z-50 pointer-events-none p-8"
                >

                    <div ref={titleContentRef}>
                        <Link to={"/"} className="pointer-events-auto inline-block">
                            <Title />
                        </Link>
                    </div>

                </div>


                {/* PARÉNTESIS */}

                <div
                    ref={parentesisRef}
                    className="fixed inset-0 z-50 pointer-events-none p-8 opacity-0"
                >

                    <h1
                        className="text-lg italic font-normal"
                        style={{
                            fontFamily: 'Castoro, sans-serif'
                        }}
                    >
                        ()
                    </h1>

                </div>


                {/* NAVBAR */}

                <div
                    ref={navBarRef}
                    className="fixed top-0 right-0 z-50 p-8"
                >

                    <NavBar />

                </div>


                {/* FOTOS */}

                <div
                    ref={imageContainerRef}
                    className={`pointer-events-none fixed top-0 right-0 z-50 pb-8 pr-8 ${firstPhoto ? '' : 'invisible'}`}
                >
                    <div className={`relative overflow-hidden ${usesFlowLayout ? 'aspect-[3/4] w-[min(168px,30vw)]' : 'h-[224px] w-[168px]'}`}>
                        {firstPhoto && <img src={firstPhoto.url} alt={firstPhoto.alt} className="h-full w-full object-cover" />}
                        {secondPhoto && <img ref={img2Ref} src={secondPhoto.url} alt={secondPhoto.alt} className="absolute inset-0 h-full w-full object-cover opacity-0" />}
                    </div>

                </div>


                {/* BIO */}

                <div
                    ref={bioRef}
                    className={`${usesFlowLayout ? `relative pt-64 sm:pt-24 ${longContentWidth} [overflow-wrap:anywhere]` : 'absolute bottom-0 left-0'} z-50 w-140 p-8 text-lg leading-tight`}
                    style={{
                        fontFamily: 'Castoro, sans-serif'
                    }}
                >

                    {aboutState.status === 'loading' && <p role="status">{text.loadingAbout}</p>}
                    {aboutState.status === 'unavailable' && <p role="status">{text.unavailableAbout}</p>}
                    {aboutState.status === 'error' && <p role="alert">{aboutState.message}</p>}
                    {aboutContent && documentToReactComponents(aboutContent.richContent, {
                        renderNode: {
                            [BLOCKS.EMBEDDED_ASSET]: node => {
                                const image = readImage(node.data.target, 'Isabel Faubel', language);
                                return <img src={image.url} alt={image.alt} />;
                            },
                        },
                    })}

                </div>


                {/* CV */}

                <div
                    ref={cvRef}
                    className={`${usesFlowLayout ? `relative mt-auto ${longContentWidth} [overflow-wrap:anywhere]` : 'absolute bottom-0 left-0 opacity-0'} z-50 w-140 p-8 flex flex-col gap-7`}
                    onFocusCapture={() => {
                        if (cvRef.current && Number(getComputedStyle(cvRef.current).opacity) < 1) {
                            window.scrollTo(0, document.documentElement.scrollHeight);
                            ScrollTrigger.update();
                        }
                    }}
                    style={{
                        fontFamily: 'Castoro, sans-serif'
                    }}
                >

                    <div>

                        <CvDownload key={language} language={language} />

                    </div>

                </div>


                {/* FOOTER */}

                <div
                    ref={footerRef}
                    className={`${usesFlowLayout ? `relative flex-wrap ${longContentWidth} [overflow-wrap:anywhere]` : 'absolute bottom-0 left-0 opacity-0'} z-50 w-140 p-8 flex flex-row gap-8 text-md italic leading-tight align-baseline text-[#4C4C4C]`}
                    style={{
                        fontFamily: 'Castoro, sans-serif'
                    }}
                >

                    <p>

                        LinkedIn <br></br>

                        Instagram <br></br>

                        (i.fuabel.minguez@gmail.es)

                    </p>


                    <p className="not-italic">

                        <br></br>

                        <br></br>

                        by Isabel Faubel ©2026

                    </p>

                </div>

            </div>

        </div>

    );

};


export default AboutMe;
