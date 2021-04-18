/* eslint-disable react/jsx-pascal-case */
import * as React from 'react';

// ===== STEAM WIDGETS =====
import W_SteamAchievements from './Steam/W_SteamAchievements';
import W_SteamFriendsInfo from './Steam/W_SteamFriendsInfo';
import W_SteamProfileInfo from './Steam/W_SteamProfileInfo';
import W_SteamTopPlayedGames from './Steam/W_SteamTopPlayedGames';

// ===== GITHUB WIDGETS =====
import CommitsWidget from './Github/CommitsWidget';
import GithubUserOverview from './Github/GithubUserOverview';
import RepoGraph from './Github/RepoGraph';
import ReposWidget from './Github/ReposWidget';

const formatString = (componentName: string) => {
    return `DragSource(Widget(${componentName}))`;
};

const trimFullName = (fullName: string) => {
    return fullName.split('(')[2].replace('))', '');
};

const ResolveComponentFromName = (name: string, data: any) => {
    switch (name) {
        // ====================
        //         Steam
        // ====================
        case formatString('W_SteamAchievements'):
            return W_SteamAchievements;
        case formatString('W_SteamFriendsInfo'):
            return W_SteamFriendsInfo;
        case formatString('W_SteamProfileInfo'):
            return W_SteamProfileInfo;
        case formatString('W_SteamTopPlayedGames'):
            return W_SteamTopPlayedGames;

        // ====================
        //        Github
        // ====================
        case formatString('CommitsWidget'):
            return CommitsWidget;
        case formatString('GithubUserOverview'):
            return GithubUserOverview;
        case formatString('RepoGraph'):
            return RepoGraph;
        case formatString('ReposWidget'):
            return ReposWidget;
        default:
            return undefined;
    }
};
// const ResolveComponentFromName = (name: string, data: any) => {
//     switch (name) {
//         // ====================
//         //         Steam
//         // ====================
//         case formatString('W_SteamAchievements'):
//             return (
//                 <W_SteamAchievements
//                     id={trimFullName(name)}
//                     component={W_SteamAchievements}
//                     onWidgetList
//                     data={data}
//                 />
//             );
//         case formatString('W_SteamFriendsInfo'):
//             return (
//                 <W_SteamFriendsInfo
//                     id={trimFullName(name)}
//                     component={W_SteamFriendsInfo}
//                     onWidgetList
//                     data={data}
//                 />
//             );
//         case formatString('W_SteamProfileInfo'):
//             return (
//                 <W_SteamProfileInfo
//                     id={trimFullName(name)}
//                     component={W_SteamProfileInfo}
//                     onWidgetList
//                     data={data}
//                 />
//             );
//         case formatString('W_SteamTopPlayedGames'):
//             return (
//                 <W_SteamTopPlayedGames
//                     id={trimFullName(name)}
//                     component={W_SteamTopPlayedGames}
//                     onWidgetList
//                     data={data}
//                 />
//             );

//         // ====================
//         //        Github
//         // ====================
//         case formatString('CommitsWidget'):
//             return (
//                 <CommitsWidget
//                     id={trimFullName(name)}
//                     component={CommitsWidget}
//                     onWidgetList
//                     data={data}
//                 />
//             );
//         case formatString('GithubUserOverview'):
//             return (
//                 <GithubUserOverview
//                     id={trimFullName(name)}
//                     component={GithubUserOverview}
//                     onWidgetList
//                     data={data}
//                 />
//             );
//         case formatString('RepoGraph'):
//             return (
//                 <RepoGraph
//                     id={trimFullName(name)}
//                     component={RepoGraph}
//                     onWidgetList
//                     data={data}
//                 />
//             );
//         case formatString('ReposWidget'):
//             return (
//                 <ReposWidget
//                     id={trimFullName(name)}
//                     component={ReposWidget}
//                     onWidgetList
//                     data={data}
//                 />
//             );
//         default:
//             return undefined;
//     }
// };

export default ResolveComponentFromName;
