import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import CvDownload from '../components/CvDownload';
import Title from '../components/Title';
import { useLanguage } from '../i18n/languageContext';
import { useAbout } from '../contentful/useAbout';
import { useTranslation } from '../i18n/translations';
import { useReducedMotion } from '../components/useReducedMotion';
import RichTextContent from '../components/RichTextContent';
gsap.registerPlugin(ScrollTrigger);

const AboutMe = () => {
    const { language } = useLanguage();
    const text = useTranslation();
    const reducedMotion = useReducedMotion();
    const aboutState = useAbout();
    const aboutContent = aboutState.status === 'ready' ? aboutState.content : null;
    const [firstPhoto, secondPhoto] = aboutContent?.photos ?? [];
    const [needsFlowLayout, setNeedsFlowLayout] = useState(false);
    const [hasPhotoError, setHasPhotoError] = useState(false);
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
            const title = titleRef.current;
            const titleContent = titleContentRef.current;
            const bio = bioRef.current;
            const cv = cvRef.current;
            const footer = footerRef.current;
            const parentesis = parentesisRef.current;

            if (!navBar || !imageContainer || !title || !titleContent || !bio || !cv || !footer || !parentesis) return;

            if (reducedMotion) {
                const positionPhoto = () => gsap.set(imageContainer, {
                    opacity: 1,
                    y: navBar.getBoundingClientRect().bottom + 20,
                });
                positionPhoto();
                window.addEventListener('resize', positionPhoto);
                return () => window.removeEventListener('resize', positionPhoto);
            }

            gsap.set(imageContainer, { opacity: 1 });

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

            const scrollTrigger = {
                trigger: sectionRef.current,
                start: 'top top',
                end: '+=300',
                scrub: true,
            };
            gsap.to([navBar, title], { opacity: 0, scrollTrigger: { ...scrollTrigger } });
            gsap.to(parentesis, { opacity: 1, scrollTrigger: { ...scrollTrigger } });

            if (!usesFlowLayout) {
                gsap.to(bio, {
                    y: () => {
                        const titleRect = titleContent.getBoundingClientRect();
                        const bioRect = bio.getBoundingClientRect();
                        return titleRect.bottom - bioRect.top;
                    },
                    scrollTrigger: { ...scrollTrigger, invalidateOnRefresh: true },
                });
                gsap.to(footer, {
                    opacity: 1,
                    scrollTrigger: { ...scrollTrigger, invalidateOnRefresh: true },
                });
                gsap.to(cv, {
                    opacity: 1,
                    y: () => {
                        const bioRect = bio.getBoundingClientRect();
                        const cvRect = cv.getBoundingClientRect();
                        const titleRect = titleContent.getBoundingClientRect();
                        return (titleRect.bottom - bioRect.top) + (bioRect.bottom - cvRect.top);
                    },
                    scrollTrigger: { ...scrollTrigger, invalidateOnRefresh: true },
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
                <div ref={titleRef} className="about-header fixed inset-0 z-50 pointer-events-none p-8">
                    <div ref={titleContentRef}>
                        <Link to="/" className="pointer-events-auto inline-block">
                            <Title />
                        </Link>
                    </div>
                </div>

                <div ref={parentesisRef} className="fixed inset-0 z-50 pointer-events-none p-8 opacity-0">
                    <h1 className="text-lg italic font-normal" style={{ fontFamily: 'Castoro, sans-serif' }}>
                        ()
                    </h1>
                </div>

                <div ref={navBarRef} className="about-header fixed top-0 right-0 z-50 p-8">
                    <NavBar />
                </div>

                <div
                    ref={imageContainerRef}
                    className={`pointer-events-none fixed top-0 right-0 z-50 pb-8 pr-8 ${firstPhoto ? '' : 'invisible'}`}
                >
                    <div className={`relative overflow-hidden ${usesFlowLayout ? 'aspect-[3/4] w-[min(168px,30vw)]' : 'h-[224px] w-[168px]'}`}>
                        {firstPhoto && <img src={firstPhoto.url} alt={firstPhoto.alt} onError={() => setHasPhotoError(true)} className="h-full w-full object-cover" />}
                        {secondPhoto && <img ref={img2Ref} src={secondPhoto.url} alt={secondPhoto.alt} onError={() => setHasPhotoError(true)} className="absolute inset-0 h-full w-full object-cover opacity-0" />}
                    </div>
                </div>

                <div
                    ref={bioRef}
                    className={`${usesFlowLayout ? `relative pt-64 sm:pt-24 ${longContentWidth} [overflow-wrap:anywhere]` : 'absolute bottom-0 left-0'} z-50 w-140 p-8 text-lg leading-tight`}
                    style={{ fontFamily: 'Castoro, sans-serif' }}
                >
                    {aboutState.status === 'loading' && <p role="status">{text.loadingAbout}</p>}
                    {aboutState.status === 'unavailable' && <p role="status">{text.unavailableAbout}</p>}
                    {aboutState.status === 'error' && <p role="alert">{aboutState.message}</p>}
                    {hasPhotoError && <p role="alert">{text.imageLoadError}</p>}
                    {aboutContent && <RichTextContent document={aboutContent.richContent} fallbackAlt="Isabel Faubel" language={language} />}
                </div>

                <div
                    ref={cvRef}
                    className={`${usesFlowLayout ? `relative mt-auto ${longContentWidth} [overflow-wrap:anywhere]` : 'absolute bottom-0 left-0 opacity-0'} z-50 w-140 p-8 flex flex-col gap-7`}
                    onFocusCapture={() => {
                        if (cvRef.current && Number(getComputedStyle(cvRef.current).opacity) < 1) {
                            window.scrollTo(0, document.documentElement.scrollHeight);
                            ScrollTrigger.update();
                        }
                    }}
                    style={{ fontFamily: 'Castoro, sans-serif' }}
                >
                    <div>
                        <CvDownload key={language} language={language} />
                    </div>
                </div>

                <div
                    ref={footerRef}
                    className={`${usesFlowLayout ? `relative flex-wrap ${longContentWidth} [overflow-wrap:anywhere]` : 'absolute bottom-0 left-0 opacity-0'} z-50 w-140 p-8 flex flex-row gap-8 text-md italic leading-tight align-baseline text-[#4C4C4C]`}
                    style={{ fontFamily: 'Castoro, sans-serif' }}
                >
                    <p>
                        LinkedIn <br />
                        Instagram <br />
                        (i.fuabel.minguez@gmail.es)
                    </p>
                    <p className="not-italic">
                        <br />
                        <br />
                        by Isabel Faubel ©2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutMe;
