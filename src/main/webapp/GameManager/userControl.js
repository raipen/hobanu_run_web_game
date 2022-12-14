import {get_cookie, ajax} from '../game/js/utils.js';

    const getCharacterInfo = async (e) => {
        const characterID = e.target.getAttribute('data-character-id');
        const characterName = e.target.innerHTML;
        const result = await ajax('../apis/getAbility.jsp', {characterId: characterID});
        console.log(result);

        let html = `<div class = "btn-two purple" style="width: 50%;">Speed: ${result.speed}</div>`;
        html += `<div class = "btn-two purple" style="width: 50%;">Life: ${result.life}</div>`;
        html += `<div class = "btn-two purple" style="width: 50%;">CoolDown: ${result.cooldown}</div>`;
        html += `<div class = "btn-3d cyan showRank" style = "width:50%;">기록 보기</div>`;
        html += `<div class = "btn-3d cyan changeExp" style = "width:50%;">수정하기</div>`;
        html += `<div class = "btn-3d red deleteCharacter" style = "width:50%;">삭제하기</div>`;
        html += `<div id="rightBottom2"></div>`;

        const rightBottom = document.querySelector("#rightBottom");
        rightBottom.innerHTML = html;

        document.querySelector(".changeExp").addEventListener('click', async (e) => {
            const characterResult = await ajax('../apis/getCharacter.jsp', {characterId: characterID});
            var lv = prompt(`현재 레벨은 ${characterResult.level}입니다.\n변경할 레벨을 입력해주세요`, `${characterResult.level}`);
            if (lv === null) {
                alert("취소되었습니다.");
                return;
            }
            var exp = prompt(`현재 경험치는 ${characterResult.exp}입니다.\n변경할 경험치를 입력해주세요`, `${characterResult.exp}`);
            if (exp === null) {
                alert("취소되었습니다.");
                return;
            }
            console.log(characterID);
            console.log(lv);
            console.log(exp);
            var result = await ajax('../apis/changeExp.jsp', {characterID: characterID, lv: lv, exp: exp});
            console.log(result.lv);
            console.log(result.exp);
            alert(`LV: ${result.lv}, EXP: ${result.exp}로 변경되었습니다.`);
        });

        document.querySelector(".deleteCharacter").addEventListener('click', async (e) => {
            var input = confirm(`'${characterName}' 캐릭터를 삭제 하시겠습니까?`);
            if (input === true) {
                const result = await ajax('../apis/deleteCharacter.jsp', {characterId: characterID});
                console.log(characterID);
                alert(`${characterName}가 삭제되었습니다.`);
                location.reload();
            } else alert(`취소되었습니다.`);
        });

        document.querySelector(".showRank").addEventListener('click', async (e) => {
            const result = await ajax('../apis/getRecordList.jsp', {id: '', characterId: characterID, mapNo: ''});
            console.log(result);
            var addhtml = `<table><thead><th>맵 이름</th><th>클리어 시간</th></thead><tbody>`;
            result.forEach(record => {
                addhtml += `<tr><td>${record.mapName}</td><td>${record.clearTime}</td></tr>`;
                console.log(record.characterName);
            })
            addhtml += `</tbody></table>`;
            //location.replace('showRank.jsp', {characterID: characterID});
            console.log(result);
            const rightBottom2 = document.querySelector("#rightBottom2");
            rightBottom2.innerHTML = addhtml;
        });
    };

    const getUserInfo = async (e) => {
        const userId = e.target.innerHTML;
        const right = document.querySelector('#right');
        const characterList = await ajax('../apis/getCharacterList.jsp', {id: userId});
        const itemList = await ajax('../apis/getItem.jsp', {id: userId});

        let html = '<div>';
        html += `<div class="btn-two large" style="text-align: center; color:black;">${userId}<br>`;
        html += `<button class = "btn-3d blue small changePW" data-user-id="${userId}">PW 변경</button>`;
        html += `<button class="btn-3d red deleteAccount" data-user-id="${userId}">계정 삭제</button>`;
        html += '</div><br><div>';
        itemList.forEach(item => {
            html += `<div class="btn-two green small" style="width: 50%;">${item.itemName} : ${item.itemCount}개</div>`;
        });

        html += '</div><br><div>'
        characterList.forEach((character) => {
            html += `<div class="btn-3d purple character" data-character-id="${character.characterID}">${character.characterName}</div>`;
        });
        html += '</div><div id="rightBottom"></div>';

        right.innerHTML = html;

        document.querySelector('.changePW').addEventListener('click', async (e) => {
            const userId = e.target.getAttribute('data-user-id');
            var newPW = prompt('변경할 비밀번호를 입력해주세요', '');
            if (newPW != null) {
                const result = await ajax('../apis/changePassword_GM.jsp', {id: userId, pwNew: newPW});
                alert(`${userId}의 비밀번호가 ${newPW}로 변경되었습니다.`);
                console.log(result);
                location.reload();
            } else alert(`취소되었습니다.`);
        });

        document.querySelector('.deleteAccount').addEventListener('click', async (e) => {
            const userId = e.target.getAttribute('data-user-id');
            var input = confirm(`${userId} 계정을 삭제 하시겠습니까?`);
            if (input === true) {
                const result = await ajax('../apis/deleteAccount_GM.jsp', {id: userId});
                console.log(result);
                alert(`${userId}가 삭제되었습니다.`);
                location.reload();
            } else alert(`취소되었습니다.`);
        });

        const characterButtons = document.querySelectorAll('.character');
        for (let i = 0; i < characterButtons.length; i++) {
            characterButtons[i].addEventListener('click', getCharacterInfo);
        }
    };

    export const getUserList = async (e) => {
        const result = await ajax('../apis/getUserList.jsp', {});
        console.log(result);
        const left = document.querySelector('#left');
        let html = '';
        for (let i = 0; i < result.length; i++)
            html += `<button class="btn-two blue small">${result[i].id}</button>`;
        left.innerHTML = html;

        const buttons = document.querySelectorAll('.blue');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', getUserInfo);
        }
    };