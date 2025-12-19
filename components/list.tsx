'use client';

import type { Icon } from '@/actions/get-icons';
import { useEffect, useRef } from 'react';

import { Card, CardActions, CardTitle } from '@/components/card';
import { SearchBar } from '@/components/search-bar';
import { getIconListByLibrary } from '@/helpers/get-icon-list';
import { useIconSearch } from '@/hooks/use-icon-search';
import { useIconLibrary } from '@/providers/icon-library';

type Props = {
  icons?: Icon[];
};

const IconItem = ({
  icon,
  iconList,
}: {
  icon: Icon;
  iconList: ReturnType<typeof getIconListByLibrary>;
}) => {
  const animationRef = useRef<{
    startAnimation: () => void;
    stopAnimation: () => void;
  }>(null);

  const foundIcon = iconList.find(({ name }) => name === icon.name);
  if (!foundIcon) return null;

  const IconComponent = foundIcon.icon;

  return (
    <Card
      key={icon.name}
      animationRef={animationRef}
      onMouseEnter={() => animationRef.current?.startAnimation()}
      onMouseLeave={() => animationRef.current?.stopAnimation()}
    >
      <IconComponent
        ref={animationRef}
        className="flex items-center justify-center [&>svg]:size-10 [&>svg]:text-neutral-800 dark:[&>svg]:text-neutral-100"
      />
      <CardTitle>{icon.name}</CardTitle>
      <CardActions {...icon} />
    </Card>
  );
};

const EmptyState = ({ query }: { query: string }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="text-secondary mb-2 text-6xl">🔍</div>
    <h3 className="text-lg font-medium">No icons found</h3>
    <p className="text-secondary mt-1 font-mono text-sm">
      No results for &quot;{query}&quot;
    </p>
    <a
      href="https://github.com/ln-dev7/icons-animated/blob/main/CONTRIBUTING.md"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contribute to the project"
      tabIndex={0}
      className="focus-visible:outline-primary mt-4 flex items-center gap-1 pr-1 font-sans text-sm text-[#3F3F47] underline-offset-4 focus-within:outline-offset-4 hover:underline focus-visible:outline-1 dark:text-[#FAFAFA]"
    >
      You can contribute here
    </a>
  </div>
);

const IconsList = ({ icons: propIcons }: Props) => {
  const { library } = useIconLibrary();
  const iconList = getIconListByLibrary(library);

  const icons =
    propIcons ||
    iconList.map(({ name, keywords }) => ({
      name,
      keywords,
    }));

  const {
    query,
    setQuery,
    filteredIcons,
    hasResults,
    resultCount,
    totalCount,
  } = useIconSearch(icons);

  useEffect(() => {
    setQuery('');
  }, [library, setQuery]);

  return (
    <div className="z-60 mt-9 mb-20 w-full">
      <SearchBar
        value={query}
        onChange={setQuery}
        resultCount={resultCount}
        totalCount={totalCount}
      />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[3px]">
        {hasResults ? (
          filteredIcons.map((icon) => (
            <IconItem key={icon.name} icon={icon} iconList={iconList} />
          ))
        ) : (
          <EmptyState query={query} />
        )}
      </div>
    </div>
  );
};

export { IconsList };
