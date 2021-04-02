import Link from 'next/link';
import firebase from '../utils/firebase';
import { OrgData, OrgUser } from '../entities/Organization';
import ActionButtonWhite from './ActionButtonWhite';
import ActionButton from './ActionButton';
import Modal from './Modal';
import ActionCard from './ActionCard';
import { useState } from 'react';

function MenuItem(props: {
  href: string;
  children: string;
  icon: JSX.Element;
  color: string;
  isActive?: boolean;
}) {
  return (
    <Link href={props.href}>
      <a className="px-2 py-1 flex items-center rounded hover:bg-blue-100 md:pr-10 md:transition-all">
        <figure
          className={`w-10 h-10 md:w-8 md:h-8 p-1 m-0.5 bg-${props.color}-50 text-${props.color}-600 rounded`}
        >
          <figcaption className="sr-only">
            {props.children}のアイコン
          </figcaption>
          {props.icon}
        </figure>
        <p className="text-xl md:text-base ml-2">{props.children}</p>
      </a>
    </Link>
  );
}

export default function Sidebar(props: {
  currentUser: firebase.User;
  currentOrg: OrgData;
  currentOrgUser: OrgUser;
}) {
  return (
    <>
      <nav className="p-1 flex justify-center flex-col items-center md:h-full md:justify-around">
        <ul>
          <li>
            <MenuItem
              color="blue"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>家のアイコン</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              }
              href="/"
            >
              ホーム
            </MenuItem>
            <MenuItem
              color="yellow"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>チャットのアイコン</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              }
              href="/contact"
            >
              お問い合わせ
            </MenuItem>
            <MenuItem
              color="purple"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>新聞のアイコン</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              }
              href="/news"
            >
              お知らせ
            </MenuItem>
            <MenuItem
              color="pink"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>?マークのアイコン</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              href="/help"
            >
              ヘルプ
            </MenuItem>
            <MenuItem
              color="green"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>iのアイコン</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              href="/information"
            >
              情報
            </MenuItem>
          </li>
        </ul>
        <div>
          <div
            className={`items-center flex sm:static mt-2 sm:mt-0 sm:bg-transparent sm:w-auto`}
          >
            <figure className="h-9 w-9 md:w-8 md:h-8 mx-3 rounded-full shadow-inner relative overflow-hidden">
              <figcaption className="sr-only">
                ユーザーのプロフィール画像
              </figcaption>
              {!!props.currentUser?.photoURL ? (
                <img
                  src={props.currentUser?.photoURL}
                  alt={`${props.currentUser?.displayName}のプロフィール画像`}
                  className="h-full w-full rounded-full bg-white z-0"
                />
              ) : (
                <figure>
                  <figcaption className="sr-only">
                    ユーザーのプロフィール画像が表示できなかったため人のイラストを表示しています
                  </figcaption>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-full h-full absolute top-0 left-0 z-0"
                  >
                    <title>人のイラスト</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </figure>
              )}
            </figure>
            <div className="mx-1">
              <ActionButtonWhite
                action={() => {
                  if (!!props.currentUser) {
                    firebase.auth().signOut();
                  }
                }}
                enabled
              >
                ログアウト
              </ActionButtonWhite>
            </div>
          </div>
          <div
            className={`items-center flex sm:static mt-1 sm:mt-0 sm:bg-transparent sm:w-auto sm:p-0 md:text-sm`}
            title={`${props.currentOrg?.name}の${
              props.currentOrgUser?.role == 'host' ? '管理者' : ''
            }${
              props.currentOrgUser?.role == 'member' ? 'メンバー' : ''
            }としてログイン中`}
          >
            <figure
              className={`h-9 w-9 md:w-9 md:h-9 mx-3 rounded-full text-gray-500 shadow-inner p-0.5 md:p-1 relative overflow-hidden ${
                props.currentOrgUser?.role == 'host'
                  ? ' bg-yellow-50 text-yellow-600'
                  : ' bg-white'
              }`}
            >
              <figcaption className="sr-only">帽子の画像</figcaption>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>帽子の画像</title>
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </figure>
            <div className="mx-1 p-1 w-24 truncate">
              {props.currentOrg?.name}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
