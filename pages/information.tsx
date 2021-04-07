import User_layout from '../layouts/User';

export default function Playground() {
  return (
    <>
      <User_layout>
        <section className="prose prose-blue md:m-10 m-5 mx-7 break-words">
          <h2>利用規約</h2>
          <p>後で書く</p>
          <h2>プライバシーポリシー</h2>
          <p>後で書く</p>
          <h2>ライセンス</h2>
          <p>
            当ソフトウェアはMITライセンスのもとで提供されています。 <br />
            Copyright &copy; 2021 Appare45 <br />
            <a href="https://github.com/appare45/pandora/blob/main/LICENSE.md">
              https://github.com/appare45/pandora/blob/main/LICENSE.md
            </a>
          </p>
          <h3>当ソフトフェアの使用しているパッケージ</h3>
          <p>
            当ソフトウェアは以下のパッケージ及びそれらが依存するパッケージを利用しています
          </p>
          <p>
            ライセンスの全文は
            <a href="https://github.com/appare45/pandora/blob/main/package.txt">
              GitHub
            </a>
            から確認できます
          </p>
          <ul>
            <li>
              <p>tailwindcss-typography</p>
              <p>
                Copyright (c) 2021 Tailwind Labs <br />
                Released under the MIT license <br />
                <a href="https://github.com/tailwindlabs/tailwindcss-typography/blob/master/LICENSE">
                  https://github.com/tailwindlabs/tailwindcss-typography/blob/master/LICENSE
                </a>
              </p>
            </li>
            <li>
              <p>firebase-js-sdk</p>
              <p>
                Copyright 2021 Google Inc. <br />
                Licensed under the Apache License, Version 2.0 (the "License");
                you may not use this file except in compliance with the License.
                You may obtain a copy of the License at <br />
                <a href="http://www.apache.org/licenses/LICENSE-2.0">
                  http://www.apache.org/licenses/LICENSE-2.0
                </a>
                <br />
                Unless required by applicable law or agreed to in writing,
                software distributed under the License is distributed on an "AS
                IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
                express or implied. See the License for the specific language
                governing permissions and limitations under the License. <br />
                <a href="https://github.com/firebase/firebase-js-sdk/blob/master/LICENSE">
                  https://github.com/firebase/firebase-js-sdk/blob/master/LICENSE
                </a>
              </p>
            </li>
            <li>
              <p>Next.js</p>
              <p>
                <p>
                  Copyright (c) 2021 Vercel, Inc. <br />
                  Released under the MIT license <br />
                  <a href="https://github.com/vercel/next.js/blob/canary/license.md">
                    https://github.com/vercel/next.js/blob/canary/license.md
                  </a>
                </p>
              </p>
            </li>
            <li>
              <p>React</p>
              <p>
                <p>
                  Copyright (c) Facebook, Inc. and its affiliates. <br />
                  Released under the MIT license <br />
                  <a href="https://github.com/facebook/react/blob/master/LICENSE">
                    https://github.com/facebook/react/blob/master/LICENSE
                  </a>
                </p>
              </p>
            </li>
          </ul>
        </section>
      </User_layout>
    </>
  );
}
