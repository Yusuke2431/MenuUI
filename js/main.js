/**
 * メインJavaScriptファイル
 * シンプルな初期化版
 */

// 基本的な初期化（即座に実行）
(function() {
    console.log('JavaScript実行開始');
    
    // サイドナビゲーションを表示
    const sideNav = document.getElementById('side-nav');
    console.log('サイドナビ要素:', sideNav);
    if (sideNav) {
        sideNav.innerHTML = `
            <div style="padding: 20px;">
                <div style="margin-bottom: 20px;">
                    <select style="width: 100%; padding: 8px;">
                        <option>チームを選択</option>
                        <option>エンジニアリング部</option>
                        <option>プロダクト開発チーム</option>
                        <option>インフラストラクチャチーム</option>
                    </select>
                </div>
                <div class="side-nav-menu">
                    <div style="margin-bottom: 10px; font-weight: bold;">ベンチマーク</div>
                    <div style="margin-left: 10px; margin-bottom: 8px; cursor: pointer;" onclick="showContent('開発生産性スコア')">開発生産性スコア</div>
                    <div style="margin-left: 10px; margin-bottom: 8px; cursor: pointer;" onclick="showContent('DevOps分析')">DevOps分析</div>
                    
                    <div style="margin-bottom: 10px; margin-top: 20px; font-weight: bold;">開発プロセス</div>
                    <div style="margin-left: 10px; margin-bottom: 8px; cursor: pointer;" onclick="showContent('サイクルタイム分析')">サイクルタイム分析</div>
                    <div style="margin-left: 10px; margin-bottom: 8px; cursor: pointer;" onclick="showContent('レビュー分析')">レビュー分析</div>
                    
                    <div style="margin-bottom: 10px; margin-top: 20px; font-weight: bold;">アクティビティ</div>
                    <div style="margin-left: 10px; margin-bottom: 8px; cursor: pointer;" onclick="showContent('チームサマリ')">チームサマリ</div>
                    <div style="margin-left: 10px; margin-bottom: 8px; cursor: pointer;" onclick="showContent('チーム詳細')">チーム詳細</div>
                    <div style="margin-left: 10px; margin-bottom: 8px; cursor: pointer;" onclick="showContent('チーム比較')">チーム比較</div>
                </div>
            </div>
        `;
    }
    
    // メインコンテンツエリアを表示
    const contentArea = document.getElementById('content-area');
    console.log('コンテンツエリア要素:', contentArea);
    if (contentArea) {
        contentArea.innerHTML = `
            <div style="padding: 40px;">
                <h1>Findy チーム管理画面</h1>
                <p>左側のメニューから項目を選択してください。</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 30px;">
                    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer;" onclick="showContent('チームサマリ')">
                        <h3>チームサマリ</h3>
                        <p>チーム全体のリードタイムやアクティビティを俯瞰して把握できる機能です</p>
                    </div>
                    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer;" onclick="showContent('レビュー分析')">
                        <h3>レビュー分析</h3>
                        <p>プルリクのレビューの速度や傾向を可視化し、ボトルネックを把握できる機能です</p>
                    </div>
                    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer;" onclick="showContent('開発生産性スコア')">
                        <h3>開発生産性スコア</h3>
                        <p>Findy Team+全体のデータをもとに、開発パフォーマンスを相対スコアで把握できる機能です</p>
                    </div>
                </div>
            </div>
        `;
    }

    // トップナビゲーションのクリックイベント
    const topNavItems = document.querySelectorAll('.top-nav-item');
    console.log('トップナビ要素数:', topNavItems.length);
    topNavItems.forEach(item => {
        item.addEventListener('click', function() {
            // アクティブ状態を更新
            document.querySelectorAll('.top-nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const key = this.getAttribute('data-key');
            contentArea.innerHTML = `
                <div style="padding: 40px;">
                    <h1>${this.textContent}メニュー</h1>
                    <p>機能は準備中です。左側のメニューから項目を選択してください。</p>
                </div>
            `;
        });
    });
})();

// コンテンツ表示用の関数
window.showContent = function(title) {
    const contentArea = document.getElementById('content-area');
    if (contentArea) {
        contentArea.innerHTML = `
            <div style="padding: 40px;">
                <h1>${title}</h1>
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 20px;">
                    <p>この機能は現在開発中です。</p>
                    <p>実際のシステムでは、${title}に関連するデータや分析結果がここに表示されます。</p>
                </div>
            </div>
        `;
    }
};
