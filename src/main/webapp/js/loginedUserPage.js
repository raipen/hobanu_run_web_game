import {get_cookie, ajax} from '../game/js/utils.js';
const right = document.getElementById('right');
const selectCharacter = document.getElementById('selectCharacter');
const itemDiv = document.getElementById('items');
const createCharacter = document.getElementById('createCharacter');
const changePW = document.getElementById('changePW');
const deleteAccount = document.getElementById('deleteAccount');

createCharacter.addEventListener('click', async () => {
    let modal = document.getElementById('modal');
    let skills = await ajax('apis/getSkillList.jsp');
    let skillList = '';
    //skillImg와 skillName으로 라디오 버튼으로 세로로 선택할 수 있게 만들기 value는 skillId
    skills.forEach((skill) => {
        skillList += `
            <input type="radio" name="skill" value="${skill.skillId}" id="${skill.skillId}"/>
            <label class="selectSkill" for="${skill.skillId}"><img src="./game/${skill.skillImg}">${skill.skillName}</label>
        `;
    });
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">캐릭터 생성</div>
                <div class="modal-body">
                    <div>캐릭터 이름
                        <input type="text" id="characterName"></input>
                    </div>
                    <div>캐릭터 스킬</div>
                    <div id="skillList">
                    ${skillList}
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="button" id="create">생성</div>
                    <div class="button" id="cancel">취소</div>
                </div>
            </div>
        `;
    modal.style.display = 'flex';
    document.getElementById('cancel').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    document.getElementById('create').addEventListener('click', async () => {
        const characterName = document.getElementById('characterName').value;
        if (characterName.length < 1) {
            alert('캐릭터 이름을 입력해주세요.');
            return;
        }
        let skillId;
        try {
            skillId = document.querySelector('input[name="skill"]:checked').value;
        } catch (e) {
            alert('스킬을 선택해주세요.');
            return;
        }
        const id = get_cookie('id');
        let result;
        result = await ajax('apis/createCharacter.jsp', {id, characterName, skillId});
        if (!result.message) {
            await getCharacterList();
            modal.style.display = 'none';
        } else {
            alert(result.message);
        }
    });
});

deleteAccount.addEventListener('click', async () => {
    let modal = document.getElementById('modal');
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">회원탈퇴</div>
                <div class="modal-body">
                    <div>비밀번호
                        <input type="password" id="password"></input>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="button" id="delete">탈퇴</div>
                    <div class="button" id="cancel">취소</div>
                </div>
            </div>
        `;
    modal.style.display = 'flex';
    document.getElementById('cancel').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    document.getElementById('delete').addEventListener('click', async () => {
        const pw = document.getElementById('password').value;
        const id = get_cookie('id');
        if ((await ajax('apis/checkPassword.jsp', {id: id, pw: pw})).result === false) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        const result = await ajax('apis/deleteAccount_client.jsp', {id: id, pw: pw});
        alert(`${id} 계정 탈퇴가 완료되었습니다`);
        location.href = './index.jsp';
    });
});

changePW.addEventListener('click', async () => {
    let modal = document.getElementById('modal');
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">비밀번호 변경</div>
                <div class="modal-body">
                    <div>현재 비밀번호
                        <input type="password" id="currentPW"></input>
                    </div>
                    <div>새 비밀번호
                        <input type="password" id="newPW"></input>
                    </div>
                    <div>새 비밀번호 확인
                        <input type="password" id="newPWCheck"></input>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="button" id="change">변경</div>
                    <div class="button" id="cancel">취소</div>
                </div>
            </div>
        `;
    modal.style.display = 'flex';
    document.getElementById('cancel').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    document.getElementById('change').addEventListener('click', async () => {
        const currentPW = document.getElementById('currentPW').value;
        const newPW = document.getElementById('newPW').value;
        const newPWCheck = document.getElementById('newPWCheck').value;
        const id = get_cookie('id');
        if (newPW !== newPWCheck) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        const result = await ajax('apis/changePassword_client.jsp', {id, pw: currentPW, pwNew: newPW});
        if (result.message !== "fail") {
            alert('비밀번호가 변경되었습니다.');
            modal.style.display = 'none';
        } else {
            alert('비밀번호가 일치하지 않습니다.');
        }
    });
});

export const getCharacterList = async () => {
    const result = await ajax('apis/getCharacterList.jsp', {id: get_cookie('id')});
    let html = '';
    result.forEach((character) => {
        html += `
                <div class="character">
                    <img src="./img/hobanu1.png"></img>
                    <div class="characterName">${character.characterName}</div>
                    <div class="characterLevel">LV.${character.lv}(${character.exp}/100)</div>
                    <div class="ability">speed/life/coolDown</div>
                    <div class="characterAbility">${character.ability.speed}/${character.ability.life}/${character.ability.coolDown}</div>
                </div>
            `;
    });
    selectCharacter.innerHTML = html;
    const characters = document.querySelectorAll('.character');
    characters.forEach((character, i) => {
        character.addEventListener('click', loadRight(result[i]));
    });

    const items = await ajax('apis/getItem.jsp', {id: get_cookie('id')});
    let itemHtml = '';
    items.forEach((item) => {
        itemHtml += `
                <div class="item">
                    <img src="./game/${item.itemImg}" style="grid-row:1/3"></img>
                    <div class="itemName">${item.itemName}</div>
                    <div class="itemCount">${item.itemCount}개</div>
                </div>`;
    });
    itemDiv.innerHTML = itemHtml;


}

const loadRight = (character) => async (e) => {
    let skillPoint = character.lv - character.ability.life - character.ability.speed - character.ability.coolDown + 3;
    let rightHtml = `
                <div class="characterName">${character.characterName}</div>
                <div class="characterLevel">LV.${character.lv}(${character.exp}/100)</div>
                <div class="abilityBox">
                    <div style="grid-column: 1/4;"> 남은 스탯 포인트: ${skillPoint}</div>
                    <div>speed</div> <div style="text-align:center">${character.ability.speed}</div><button class="abilityUp" value="speed">▲</button>
                    <div>life</div> <div style="text-align:center">${character.ability.life}</div><button class="abilityUp" value="life">▲</button>
                    <div>coolDown</div> <div style="text-align:center">${character.ability.coolDown}</div><button class="abilityUp" value="coolDown">▲</button>
                </div>
                <div class="skill">스킬: ${character.skill.skillName}</div>
                <div class="play">플레이</div>
                <div class="delete">삭제</div>
                `;
    right.innerHTML = rightHtml;
    const abilityUps = document.querySelectorAll('.abilityUp');
    abilityUps.forEach((abilityUp) => {
        abilityUp.addEventListener('click', abilityUpClick(character));
    });
    document.querySelector('.play').addEventListener('click', async () => {
        await ajax('apis/playCharacter.jsp', {characterId: character.characterID});
        window.location.href = './choiceMap.jsp';
    });
    document.querySelector('.delete').addEventListener('click', async () => {
        //모달로 정말 삭제할건지 물어보기
        const modal = document.getElementById('modal');
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">정말 삭제하시겠습니까?</div>
                <div class="modal-footer">
                    <div class="button" id="change">삭제</div>
                    <div class="button" id="cancel">취소</div>
                </div>
            </div>`;
        document.querySelector('#cancel').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        document.querySelector('#change').addEventListener('click', async () => {
            modal.style.display = 'none';
            const result = await ajax('apis/deleteCharacter.jsp', {characterId: character.characterID});
            if (result.message === 'success') {
                getCharacterList();
                right.innerHTML = ``;
            }
        });
    });
}

const abilityUpClick = (character) => async (e) => {
    const ability = e.target.getAttribute("value");
    e.disabled = true;
    let skillPoint = character.lv - character.ability.life - character.ability.speed - character.ability.coolDown + 3;

    if (skillPoint <= 0) {
        alert('스킬 포인트가 부족합니다.');
        return;
    }

    let result = await ajax('apis/upgradeAbility.jsp', {characterId: character.characterID, ability});

    if (result.message === 'success') {
        character.ability[ability]++;
        loadRight(character)(e);
    }
    e.disabled = false;
}