'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import './scroller.css';
import Image from 'next/image';

const createSeededRandom = (seed) => {
    let value = seed;
    return () => {
        value = (value * 1664525 + 1013904223) % 4294967296;
        return value / 4294967296;
    };
};

const shuffleItems = (items, seed) => {
    const random = createSeededRandom(seed);
    const nextItems = [...items];

    for (let index = nextItems.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
    }

    return nextItems;
};

const buildLoopBase = (items, minItems = 16) => {
    if (!items.length) return [];
    const repeatCount = Math.max(1, Math.ceil(minItems / items.length));
    return Array.from({ length: repeatCount }, () => items).flat();
};

const splitIntoSets = (items, setCount) => {
    const sets = Array.from({ length: setCount }, () => []);

    items.forEach((item, index) => {
        sets[index % setCount].push(item);
    });

    return sets.map((set) => (set.length ? set : items));
};

const LogoScrollerComponent = ({ items = [], className = '' }) => {
    const scrollerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [activeByRow, setActiveByRow] = useState({});
    const rowCount = isMobile ? 4 : 2;

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handleChange = () => setIsMobile(mediaQuery.matches);

        handleChange();
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    useEffect(() => {
        const root = scrollerRef.current;
        if (!root) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        root.querySelectorAll('.logo-scroller-row').forEach((row) => {
            row.setAttribute('data-animated', 'true');
        });
    }, [rowCount]);

    const logoItems = items
        .filter((item) => item?.thumbnail)
        .reduce((accumulator, item, index) => {
            const id = item.id ?? index;
            const url = item.thumbnail;

            if (accumulator.some((entry) => entry.id === id || entry.url === url)) {
                return accumulator;
            }

            accumulator.push({
                id,
                name: item.title || 'Skill',
                url,
            });

            return accumulator;
        }, []);

    const rowSets = useMemo(() => splitIntoSets(logoItems, rowCount), [logoItems, rowCount]);
    const rows = useMemo(() => Array.from({ length: rowCount }, (_, index) => index), [rowCount]);

    const handleLogoClick = (rowIndex, item, loopIndex) => {
        setActiveByRow((previousState) => {
            const current = previousState[rowIndex];

            if (current && current.id === item.id && current.loopIndex === loopIndex) {
                return {
                    ...previousState,
                    [rowIndex]: null,
                };
            }

            return {
                ...previousState,
                [rowIndex]: {
                    id: item.id,
                    loopIndex,
                    title: item.name,
                },
            };
        });
    };

    if (!logoItems.length) return null;

    return (
        <div ref={scrollerRef} className={className + ' w-full overflow-hidden'}>
            <div className="logo-scroller-grid">
                {rows.map((rowIndex) => {
                    const rowItems = shuffleItems(rowSets[rowIndex], rowIndex + 1);
                    const loopBase = buildLoopBase(rowItems, 16);
                    const loopItems = [...loopBase, ...loopBase];
                    const activeRow = activeByRow[rowIndex];
                    const isRowPaused = Boolean(activeRow);

                    return (
                    <div
                        key={rowIndex}
                        className="logo-scroller-row scroller"
                        data-direction={rowIndex % 2 === 0 ? 'right' : 'left'}
                        data-speed='slow'
                        data-paused={isRowPaused ? 'true' : 'false'}
                    >
                        <div className="logo-scroller-track scroller__inner">
                            {loopItems.map((item, index) => (
                                <button
                                    type="button"
                                    key={`${rowIndex}-${item.id}-${index}`}
                                    className="relative shrink-0 rounded-2xl border border-white/10 bg-white/50 p-3 shadow-lg shadow-black/20 backdrop-blur-2xl transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80"
                                    onClick={() => handleLogoClick(rowIndex, item, index)}
                                >
                                    {activeRow && activeRow.id === item.id && activeRow.loopIndex === index && (
                                        <span className="absolute left-1/2 top-1 z-10 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-md">
                                            {activeRow.title}
                                        </span>
                                    )}
                                    <Image
                                        width={72}
                                        height={72}
                                        src={item.url}
                                        alt={item.name}
                                        className="h-18 w-18 rounded-xl object-contain"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LogoScrollerComponent;