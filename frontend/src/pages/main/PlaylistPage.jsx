import { FolderOpenIcon, HeartIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/main/Breadcrumb';
import Tabs from '../../components/main/Tabs';
import All from '../../components/main/playlists/All';
import Playlist from '../../components/main/playlists/Playlists';

function PlaylistsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [tabs, setTabs] = useState([
    { name: "All", icon: FolderOpenIcon, current: true },
    { name: "Playlists", icon: HeartIcon, current: false },
  ]);

  const setCurrentTab = (selectedTab) => {
    setTabs(
      tabs.map((tab) => {
        if (selectedTab === tab.name) tab.current = true;
        else tab.current = false;
        return tab;
      })
    );
  };
  
  const pages = [{ name: "Playlists", href: "/playlists/", current: true }];

  return (
    <div>
      <div className="-mt-4 mb-6">
        <Breadcrumb pages={pages} />
      </div>
      <div className="flex justify-between">
        <div className="text-3xl font-bold">Playlists</div>
      </div>
      <Tabs tabs={tabs} setCurrentTab={setCurrentTab} />

      <div
        className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50"
      >
        {tabs.find((tab) => tab.current).name === "All" && (<All />)}
        {tabs.find((tab) => tab.current).name === "Playlists" && (<Playlist />)}
      </div>
    </div>
  );
}

export default PlaylistsPage