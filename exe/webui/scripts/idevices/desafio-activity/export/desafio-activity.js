/**
 * QuExt Activity iDevice (export code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $eXeDesafio = {
    idevicePath: "",
    borderColors: {
        black: "#1c1b1b",
        blue: '#5877c6',
        green: '#2a9315',
        red: '#ff0000',
        white: '#ffffff',
        yellow: '#f3d55a'
    },
    colors: {
        black: "#1c1b1b",
        blue: '#d5dcec',
        green: '#cce1c8',
        red: '#f7c4c4',
        white: '#ffffff',
        yellow: '#f5efd6'
    },
    image: '',
    widthImage: 0,
    heightImage: 0,
    options: {},
    userName: '',
    scorm: '',
    previousScore: '',
    initialScore: '',
    msgs: '',
    fontSize: '18px',
    isInExe: false,
    init: function () {
        this.activities = $('.desafio-IDevice');
        if (this.activities.length == 0) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('QuExt') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/desafio-activity/export/" : "";
        this.enable();
    },
    enable: function () {
        $eXeDesafio.loadGame();
    },

    loadGame: function () {
        $eXeDesafio.options = [];
        $eXeDesafio.activities.each(function (i) {
            var version=$(".desafio-version", this).eq(0).text(),
                dl = $(".desafio-DataGame", this),
                mOption = $eXeDesafio.loadDataGame(dl,version),
                msg = mOption.msgs.msgPlayStart;
            $eXeDesafio.options.push(mOption);
            var desafio = $eXeDesafio.createInterfaceQuExt(i);
            dl.before(desafio).remove();
            $('#desafioGameMinimize-' + i).hide();
            $('#desafioGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#desafioGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#desafioGameContainer-' + i).show();
            }
            $('#desafioMessageMaximize-' + i).text(msg);
            
            $('#desafioDescription-' + i).append($(".desafio-EDescription", this));
            $('.desafio-ChallengeDescription', this).each(function () {
                $('#desafioFeedBacks-' + i).append($(this));
            });
            $('#desafioDescription-' + i).hide();
            $('#desafioFeedBacks-' + i).hide();
            $eXeDesafio.addEvents(i);
        });


    },
    createInterfaceQuExt: function (instance) {
        var html = '',
            path = $eXeDesafio.idevicePath,
            msgs = $eXeDesafio.options[instance].msgs;
        html += '<div class="desafio-MainContainer">\
                <div class="desafio-GameMinimize" id="desafioGameMinimize-' + instance + '">\
                    <a href="#" class="desafio-LinkMaximize" id="desafioLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'desafioIcon.png" class="desafio-Icons desafio-IconMinimize" alt="Mostrar actividad">\
                        <div class="desafio-MessageMaximize" id="desafioMessageMaximize-' + instance + '"></div>\
                    </a>\
                </div>\
                <div class="desafio-GameContainer" id="desafioGameContainer-' + instance + '">\
                    <div class="desafio-GameScoreBoard">\
                        <div class="desafio-GameChallenges" id="desafioGameChallenges-' + instance + '">\
                            <a href="#" class="desafio-LinkDesafio" id="desafioDesafio-' + instance + '" title="Desafio">\
                                <strong><span class="sr-av">' + msgs.msgDesafio + ':</span></strong>\
                                <div class="desafio-GameDesafio"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="0" id="desafioLink0-' + instance + '" title="Reto 1">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C0"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="1" id="desafioLink1-' + instance + '" title="Reto 2">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C1"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="2" id="desafioLink2-' + instance + '" title="Reto 3">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C2"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="3" id="desafioLink3-' + instance + '" title="Reto 4">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C3"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="4"  id="desafioLink4-' + instance + '" title="Reto 5">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C4"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="5"  id="desafioLink5-' + instance + '" title="Reto 6">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C5"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="6" id="desafioLink6-' + instance + '" title="Reto 7">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C6"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="7"  id="desafioLink7-' + instance + '" title="Reto 8">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C7"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="8" id="desafioLink8-' + instance + '" title="Reto 9">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C8"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="9" id="desafioLink9-' + instance + '" title="Reto 10">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C9"></div>\
                            </a>\
                        </div>\
                        <div class="desafio-TimeNumber">\
                                <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
                                <div class="exeQuextIcons34  exeQuextIcons34-Time"></div>\
                                <p id="desafioPTime-' + instance + '">00:00:00</p>\
                                <a href="#" class="desafio-LinkMinimize" id="desafioLinkMinimize-' + instance + '" title="Minimizar">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="exeQuextIcons34 exeQuextIcons34-Minimize"></div>\
                                </a>\
                        </div>\
                    </div>\
                    <div class="desafio-ShowClue" id="desafioShowClue-' + instance + '">\
                        <div class="sr-av">' + msgs.msgClue + ':</div>\
                        <p class="desafio-PShowClue" id="desafioPShowClue-' + instance + '"></p>\
                    </div>\
                    <div class="desafio-Multimedia" id="desafioMultimedia-' + instance + '">\
                        <img class="desafio-Cursor" id="desafioCursor-' + instance + '" src="' + path + 'desafioCursor.gif" alt="Cursor" />\
                        <img  src="" class="desafio-Images" id="desafioImagen-' + instance + '" alt="' + msgs.msgNoImage + '" />\
                        <img src="' + path + 'desafioHome.png" class="desafio-Images" id="desafioCover-' + instance + '" alt="' + msgs.msImage + '" />\
                        <div class="desafio-GameOver" id="desafioGamerOver-' + instance + '">\
                            <div class="desafio-TextClueGGame" id="desafioTextClueGGame-' + instance + '"></div>\
                            <div class="desafio-SolvedChallenges">\
                                    <p id="desafioOverScore-' + instance + '">Score: 0</p>\
                                </div>\
                            <div class="desafio-DataImageGameOver">\
                                <img src="' + path + 'quextGameWon.png" class="desafio-HistGGame" id="desafioHistGGame-' + instance + '" alt="' + msgs.mgsAllQuestions + '" />\
                                <img src="' + path + 'quextGameLost.png" class="desafio-LostGGame" id="desafioLostGGame-' + instance + '"  alt="' + msgs.msgLostLives + '" />\
                            </div>\
                        </div>\
                    </div>\
                    <div class="desafio-Title" id="desafioTitle-' + instance + '"></div>\
                    <div class="desafio-Description" id="desafioDescription-' + instance + '"></div>\
                    <div class="desafio-FeedBacks" id="desafioFeedBacks-' + instance + '"></div>\
                    <div class="desafio-MessageInfo" id="desafioMessageInfo-' + instance + '">\
                    <div class="sr-av">Information</div>\
                    <p id="desafioPInformation-' + instance + '"></p>\
                    </div>\
                    <div class="desafio-SolutionDiv" id="desafioSolutionDiv-' + instance + '">\
                        <label>' + msgs.mgsSolution + ':<input type="text" class="desafio-Solution"  id="desafioSolution-' + instance + '"></label>\
                        <input type="button" class="desafio-SolutionButton" id="desafioSolutionButton-' + instance + '"   value="' + msgs.msgSubmit + '" />\
                    </div>\
                    <div class="desafio-CodeAccessDiv" id="desafioCodeAccessDiv-' + instance + '">\
                        <div class="desafio-MessageCodeAccessE" id="desafioMesajeAccesCodeE-' + instance + '"></div>\
                        <div class="desafio-DataCodeAccessE">\
                            <label>' + msgs.msgCodeAccess + ':</label><input type="text" class="desafio-CodeAccessE"  id="desafioCodeAccessE-' + instance + '">\
                            <input type="button" class="desafio-CodeAccessButton" id="desafioCodeAccessButton-' + instance + '"   value="' + msgs.msgSubmit + '" />\
                        </div>\
                    </div>\
                    <div class="desafio-StartGameDiv" id="desafioStartGameDiv-' + instance + '">\
                        <a href="#" class="desafio-StartGame"  id="desafioStartGame-' + instance + '" title="' + msgs.Play + '">' + msgs.msgStartGame + '</a>\
                    </div>\
                    <div class="desafio-DateDiv" id="desafioDateDiv-' + instance + '">\
                        <p class="desafio-Date"  id="desafioDate-' + instance + '">'+msgs.msgDate+':</p>\
                        <a href="#" class="desafio-LinkReboot" id="desafioRebootButton-' + instance + '" title="' + msgs.msgReboot + '">\
                            <strong><span class="sr-av">' + msgs.msgReboot + ':</span></strong>\
                                <div class="desafio-RebootImg exeDesafio-IconReboot"></div>\
                        </a>\
                    </div>\
                </div>\
            </div>\
            '
        return html;
    },
    createArrayStateChallenges: function (type, mlength) {
        var chs = []
        for (var i = 0; i < mlength; i++) {
            var state = 0;
            if (i == 0) {
                state = 3;
            } else if (type == 1) {
                state = 1;
            }
            var p = {
                solved: 0,
                state: state
            }
            chs.push(p)
        }
        return chs;
    },



    Decrypt: function (str) {
        if (!str) str = "";
        str = (str == "undefined" || str == "null") ? "" : str;
        str=unescape(str)
        try {
            var key = 146;
            var pos = 0;
            ostr = '';
            while (pos < str.length) {
                ostr = ostr + String.fromCharCode(key ^ str.charCodeAt(pos));
                pos += 1;
            }

            return ostr;
        } catch (ex) {
            return '';
        }
    },
    checkWord: function (word, answord) {
        var sWord = $.trim(word).replace(/\s+/g, " ").toUpperCase().replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/, ""),
            sAnsWord = $.trim(answord).replace(/\s+/g, " ").toUpperCase().replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/, "");
        sWord = $.trim(sWord);
        sAnsWord = $.trim(sAnsWord);
        if (sWord.indexOf('|') == -1) {
            return sWord == sAnsWord;
        }
        var words = sWord.split('|');
        for (var i = 0; i < words.length; i++) {
            var mword = $.trim(words[i]).replace(/.$/, "").replace(/,$/, "").replace(/;$/, "");
            if (mword == sAnsWord) {
                return true;
            }
        }
        return false;
    },

    loadDataGame: function (data,version) {
        var json = data.text();
        if (version==1 || !json.startsWith('{')){
            json=$eXeDesafio.Decrypt(json);
        }
        var mOptions = $eXeDesafio.isJsonString(json);
        mOptions.gameOver = false;
        mOptions.numberQuestions = mOptions.challengesGame.length;
        mOptions.typeQuestion = 0;
        mOptions.activeChallenge = 0;
        mOptions.desafioDate = "";
        mOptions.started = false;
        mOptions.counter = 0;
        mOptions.endGame = false;
        mOptions.desafioSolved = false;
        mOptions.solvedsChallenges = [];
        mOptions.stateChallenges = $eXeDesafio.createArrayStateChallenges(mOptions.desafioType, mOptions.challengesGame.length);
        return mOptions;
    },
    changeImageButtonState: function (instance, type) {
        var mOptions = $eXeDesafio.options[instance],
            imgDesafio = "desafioIcon0.png";
        if (type == 0) {
            imgDesafio = "desafioIcon1.png";
        }
        imgDesafio = "url(" + $eXeDesafio.idevicePath + imgDesafio + ") no-repeat 0 0";
        $('#desafioDesafio-' + instance).find(".desafio-GameDesafio").css({
            "background": imgDesafio
        })
        var $buttonChalleng = $('#desafioGameChallenges-' + instance).find('.desafio-LinkChallenge')
        $buttonChalleng.each(function (i) {
            if (i < mOptions.stateChallenges.length) {
                var state = mOptions.stateChallenges[i].state,
                    left = (-34 * i) + "px",
                    top = (-34 * state) + 'px';
                mcss = "url(" + $eXeDesafio.idevicePath + "exeRetosIcons.png) no-repeat " + left + " " + top;
                $(this).find(".exeQuextRetos").css({
                    "background": mcss
                })
            }
        });

    },
    isJsonString: function (str) {
        try {
            var o = JSON.parse(str, null, 2);
            if (o && typeof o === "object") {
                return o;
            }
        } catch (e) {}
        return false;
    },
    addZero: function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    },
    getActualFullDate: function () {
        var d = new Date();
        var day = $eXeDesafio.addZero(d.getDate());
        var month = $eXeDesafio.addZero(d.getMonth() + 1);
        var year = $eXeDesafio.addZero(d.getFullYear());
        var h = $eXeDesafio.addZero(d.getHours());
        var m = $eXeDesafio.addZero(d.getMinutes());
        var s = $eXeDesafio.addZero(d.getSeconds());
        return day + "/" + month + "/" + year + " (" + h + ":" + m + ":" + s + ")";
    },
    addEvents: function (instance) {
        var mOptions = $eXeDesafio.options[instance];
        window.addEventListener('unload', function () {
            if (mOptions.gameStarted || mOptions.gameOver) {
               $eXeDesafio.saveDataStorage(instance);
            }
        });
        $("#desafioSolutionDiv-" + instance).hide();
        var $buttonChalleng = $('#desafioGameChallenges-' + instance).find('.desafio-LinkChallenge')
        $buttonChalleng.each(function (i) {
            $(this).hide();
            if (i < mOptions.challengesGame.length) {
                $(this).show();
            }
        });
        $('#desafioGamerOver-' + instance).css('display', 'flex');
        $('#desafioLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#desafioGameContainer-" + instance).show()
            $("#desafioGameMinimize-" + instance).hide();
        });
        $("#desafioLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#desafioGameContainer-" + instance).hide();
            $("#desafioGameMinimize-" + instance).css('visibility', 'visible').show();
        });

        $('#desafioGamerOver-' + instance).hide();
        $('#desafioCodeAccessDiv-' + instance).hide();
        $('#desafioVideo-' + instance).hide();
        $('#desafioImagen-' + instance).hide();
        $('#desafioCursor-' + instance).hide();
        $('#desafioCover-' + instance).show();


        $('#desafioSolution-' + instance).on("keydown", function (event) {
            var dstate = $('#desafioSolution-' + instance).prop('readonly');
            if (dstate) return;
            if (event.which === 13 || event.keyCode === 13) {
                $eXeDesafio.answerChallenge(instance);
                return false;
            }
            return true;
        });

        $('#desafioGameChallenges-' + instance).on('click touchstart', '.desafio-LinkChallenge', function (e) {
            e.preventDefault();
            if (!mOptions.gameStarted) {
                return;
            }
            var number = parseInt($(this).data('number'));

            $eXeDesafio.showChallenge(number, instance);

        });

        $('#desafioDesafio-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            if (mOptions.gameStarted) {
                $eXeDesafio.showDesafio(instance);
            };
        });
        $('#desafioRebootButton-' + instance).on('click touchstart', function (e) {
        
            e.preventDefault();
            if (window.confirm(mOptions.msgs.msgDesafioReboot)) {
                $eXeDesafio.rebootGame(instance);
            }

        });
        $('#desafioStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
        $('#desafioStartGame-' + instance).on('click', function (e) {
            e.preventDefault();
             $eXeDesafio.startGame(instance,0);
        });
        $('#desafioSolutionButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var dstate = $('#desafioSolution-' + instance).prop('readonly');
            if (dstate) return;
            $eXeDesafio.answerChallenge(instance);
        });

        $('#desafioInstructions-' + instance).text(mOptions.instructions);
        $('#desafioPNumber-' + instance).text(mOptions.numberQuestions);
        $('#desafioInstruction-' + instance).text(mOptions.instructions);
        $('#desafioSendScore-' + instance).hide();
        document.title = mOptions.title;
        $('meta[name=author]').attr('content', mOptions.author);
        $('#desafioShowClue-' + instance).hide();
        mOptions.gameOver = false;
        mOptions.counter = parseInt(mOptions.desafioTime) * 60;
        mOptions.activeChallenge = 0;
        var dataDesafio = $eXeDesafio.getDataStorage(instance);
         if (dataDesafio) {
             if (mOptions.desafioType != dataDesafio.desafioType || dataDesafio.numberChallenges != mOptions.challengesGame.length || dataDesafio.desafioTime != mOptions.desafioTime) {
                localStorage.removeItem('dataDesafio-' + instance);
             } else {
                $eXeDesafio.reloadGame(instance, dataDesafio);
             }
         }

    },

    rebootGame: function (instance) {
        var mOptions = $eXeDesafio.options[instance];
        clearInterval(mOptions.counterClock);
        mOptions.stateChallenges = $eXeDesafio.createArrayStateChallenges(mOptions.desafioType, mOptions.challengesGame.length);
        mOptions.gameOver = false;
        mOptions.counter = parseInt(mOptions.desafioTime) * 60;
        mOptions.activeChallenge = 0;
        localStorage.removeItem('dataDesafio-' + instance);
        mOptions.gameStarted = false;
        mOptions.started = false;
        mOptions.endGame = false;
        mOptions.desafioDate = "";
        mOptions.desafioSolved = false;
        mOptions.typeQuestion = 0;
        mOptions.solvedsChallenges=[];
        $eXeDesafio.startGame(instance, mOptions.typeQuestion, mOptions.activeChallenge);
    },
    showDesafio: function (instance) {
        var mOptions = $eXeDesafio.options[instance],
            message = mOptions.msgs.msgChallengesAllCompleted,
            type = 2;
        mOptions.typeQuestion = 0;
        mOptions.activeChallenge = 0;
        $('#desafioSolution-' + instance).prop('readonly', false);
        $('#desafioSolution-' + instance).val('');
        $("#desafioSolutionDiv-" + instance).show();
        $('#desafioTitle-' + instance).text(mOptions.desafioTitle);
        $('#desafioDescription-' + instance).show();
        $('#desafioFeedBacks-' + instance).hide();
        for (var i = 0; i < mOptions.stateChallenges.length; i++) {
            if (i < mOptions.challengesGame.length) {
                var mc = mOptions.stateChallenges[i];
                if (mc.state > 0) {
                    if (mc.solved == 0) {
                        mc.state = 1
                        type = 1;
                        $("#desafioSolution-" + instance).prop('readonly', true);
                        $("#desafioSolutionDiv-" + instance).hide();
                        message = mOptions.msgs.msgCompleteAllChallenged;
                    } else {
                        mc.state = 2
                    }
                }
            }
        }
        $eXeDesafio.showMessage(type, message, instance);
        $eXeDesafio.changeImageButtonState(instance, mOptions.typeQuestion);


    },
    showChallenge: function (number, instance) {
        var mOptions = $eXeDesafio.options[instance],
            solution = mOptions.challengesGame[number].solution,
            title = mOptions.challengesGame[number].title,
            solved = mOptions.stateChallenges[number].solved,
            type = 0,
            message = mOptions.msgs.msgWriteChallenge;
        if (mOptions.stateChallenges[number].state == 0) {
            return;
        };
        $eXeDesafio.changeStateButton(instance);
        $("#desafioSolutionDiv-" + instance).show();
        mOptions.typeQuestion = 1;
        mOptions.activeChallenge = number;
        mOptions.stateChallenges[number].state = 3;
        $('#desafioSolution-' + instance).prop('readonly', false);
        $('#desafioTitle-' + instance).text(title);
        $('#desafioFeedBacks-' + instance).show();
        var $chs=$('#desafioFeedBacks-' + instance).children('div');
        $chs.hide();
        $chs.eq(number).show();
 
        $('#desafioDescription-' + instance).hide();
        $('#desafioSolution-' + instance).val('');
        if (solved == 1) {
            $('#desafioSolution-' + instance).val(solution);
            $("#desafioSolution-" + instance).prop('readonly', true);
            type = 1;
            message = mOptions.msgs.msgSolvedChallenge;
        }
        $eXeDesafio.showMessage(type, message, instance);
        $eXeDesafio.changeImageButtonState(instance, mOptions.typeQuestion);

    },

    saveDataStorage: function (instance) {
        var mOptions = $eXeDesafio.options[instance];
        if (mOptions.desafioDate == "") {
            mOptions.desafioDate = $eXeDesafio.getActualFullDate();
            $('#desafioDate-' + instance).text(mOptions.msgs.msgStartTime+': ' + mOptions.desafioDate);
        }

        var data = {
            'started': mOptions.gameStarted || mOptions.gameOver,
            'endGame': mOptions.endGame,
            'desafioSolved': mOptions.desafioSolved,
            'counter': mOptions.counter,
            'desafioDate': mOptions.desafioDate,
            'desafioTime': mOptions.desafioTime,
            'activeChallenge': mOptions.activeChallenge,
            'desafioType': mOptions.desafioType,
            'numberChallenges': mOptions.challengesGame.length,
            'typeQuestion': mOptions.typeQuestion,
            'solvedsChallenges': mOptions.solvedsChallenges,
            'stateChallenges':mOptions.stateChallenges
        }
        localStorage.setItem('dataDesafio-' + instance, JSON.stringify(data));
    },
    changeStateButton: function (instance) {
        var mOptions = $eXeDesafio.options[instance];
        for (var i = 0; i < mOptions.stateChallenges.length; i++) {
            if (mOptions.desafioType == 0) {
                if (i < mOptions.solvedsChallenges.length) {
                    mOptions.stateChallenges[i].state = 2;
                } else if (mOptions.solvedsChallenges.length < mOptions.stateChallenges.length) {
                    mOptions.stateChallenges[mOptions.solvedsChallenges.length].state = 1;
                }
            } else {
                if (mOptions.stateChallenges[i].state > 0) {
                    mOptions.stateChallenges[i].state = 1;
                    if (mOptions.stateChallenges[i].solved == 1) {
                        mOptions.stateChallenges[i].state = 2;
                    }
                }
            }

        }
    },
    getDataStorage: function (instance) {
        var data = $eXeDesafio.isJsonString(localStorage.getItem('dataDesafio-' + instance));
        return data;
    },
    maximizeMultimedia: function (maximize, instance) {
        var css = {
            "height": "315px",
            "width": "560px",
            "margin": "auto"
        };
        $eXeDesafio.fontSize = "18px";
        if (maximize) {
            var h = window.innerHeight - 365 > 750 ? 750 : window.innerHeight - 365;
            h = window.innerHeight <= 768 ? window.innerHeight - 345 : h;
            var p = (h / 315),
                w = p * 560;
            css = {
                "height": h + 'px',
                "width": w + 'px',
                "margin": "auto"
            };
            p = p > 1.5 ? 1.5 : p;
            hQ = 45 * p;
            $eXeDesafio.fontSize = "24px";
        }
        $('#desafioMultimedia-' + instance).css(css);
        $eXeDesafio.refreshImageActive(instance);
    },
    refreshImageActive: function (instance) {
        var mOptions = $eXeDesafio.options[instance],
            mQuextion = mOptions.challengesGame[mOptions.activeChallenge];
        $("#desafioCover-" + instance).prop('src', $eXeDesafio.idevicePath + 'desafioHome.png')
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                    console.log('Error loading image');
                } else {
                    var mData = $eXeDesafio.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $eXeDesafio.drawImage(this, mData);

                }
            });
        if (typeof mQuextion == "undefined") {
            return;
        }
        if (mQuextion.type === 1) {
            $("#desafioImagen-" + instance).prop('src', mQuextion.url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                        alt = mOptions.msgs.msgNoImage;
                    } else {
                        var mData = $eXeDesafio.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeDesafio.drawImage(this, mData);
                        $('#desafioImagen-' + instance).show();
                        $('#desafioCover-' + instance).hide();
                        alt = mQuextion.alt;
                        if (mQuextion.x > 0 || mQuextion.y > 0) {
                            var left = mData.x + (mQuextion.x * mData.w);
                            var top = mData.y + (mQuextion.y * mData.h);
                            $('#desafioCursor-' + instance).css({
                                'left': left + 'px',
                                'top': top + 'px'
                            });
                        }
                    }
                });
            $('#desafioImagen-' + instance).attr('alt', mQuextion.alt);
        }
    },
    placeImageWindows: function (image, naturalWidth, naturalHeight) {
        var wDiv = $(image).parent().width() > 0 ? $(image).parent().width() : 1,
            hDiv = $(image).parent().height() > 0 ? $(image).parent().height() : 1,
            varW = naturalWidth / wDiv,
            varH = naturalHeight / hDiv,
            wImage = wDiv,
            hImage = hDiv,
            xImagen = 0,
            yImagen = 0;
        if (varW > varH) {
            wImage = parseInt(wDiv);
            hImage = parseInt(naturalHeight / varW);
            yImagen = parseInt((hDiv - hImage) / 2);
        } else {
            wImage = parseInt(naturalWidth / varH);
            hImage = parseInt(hDiv);
            xImagen = parseInt((wDiv - wImage) / 2);
        }
        return {
            w: wImage,
            h: hImage,
            x: xImagen,
            y: yImagen
        }
    },
    drawImage: function (image, mData) {
        $(image).css({
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
    },
    showScoreGame: function (type, instance) {
        var mOptions = $eXeDesafio.options[instance],
            msgs = mOptions.msgs,
            $desafioHistGGame = $('#desafioHistGGame-' + instance),
            $desafioLostGGame = $('#desafioLostGGame-' + instance),
            $desafioClueGGame = $('#desafioClueGGame-' + instance),
            $desafioOverPoint = $('#desafioOverScore-' + instance),
            $desafioTextClueGGame = $('#desafioTextClueGGame-' + instance),
            $desafioGamerOver = $('#desafioGamerOver-' + instance),
            message = "",
            mtype = 2;
        $desafioHistGGame.hide();
        $desafioLostGGame.hide();
        $desafioClueGGame.hide();
        $desafioOverPoint.show();
        $desafioTextClueGGame.hide();
        switch (parseInt(type)) {
            case 0:
                message = $eXeDesafio.getRetroFeedMessages(true, instance) + ' ' +mOptions.msgs.msgDesafioSolved;
                $desafioHistGGame.show();
                break;
            case 1:
                mtype = 1;
                message = mOptions.msgs.msgEndTimeRestart;
                $desafioLostGGame.show();
                break;
            case 2:
                message = msgs.msgInformationLooking
                $desafioOverPoint.hide();
                $desafioClueGGame.show();
                $desafioTextClueGGame.show();
                break;
            default:
                break;
        }
        $('#desafioShowClue-' + instance).hide();
        $eXeDesafio.showMessage(mtype, message, instance);
        $desafioOverPoint.text(msgs.msgChallengesCompleted + ': ' + mOptions.solvedsChallenges.length );
        $desafioGamerOver.show();
        $('#desafioDescription-' + instance).hide();

    },
    reloadGame: function (instance, dataDesafio) {
        var mOptions = $eXeDesafio.options[instance],
            colorMessge = 1;
        mOptions.started = dataDesafio.started;
        mOptions.counter = dataDesafio.counter;
        mOptions.activeChallenge = dataDesafio.activeChallenge;
        mOptions.desafioDate = dataDesafio.desafioDate;
        mOptions.typeQuestion = dataDesafio.typeQuestion;
        mOptions.endGame = dataDesafio.endGame;
        mOptions.desafioSolved = dataDesafio.desafioSolved;
        mOptions.stateChallenges = dataDesafio.stateChallenges;
        mOptions.solvedsChallenges=dataDesafio.solvedsChallenges;
        $('#desafioDate-' + instance).text( mOptions.msgs.msgStartTime+ ': ' + dataDesafio.desafioDate);
        var ds = dataDesafio.desafioSolved ? 0 : 1;
        if (mOptions.endGame) {
            var message = mOptions.msgs.msgDesafioSolved,
                colorMessge = 2;

            if (!dataDesafio.desafioSolved) {
                message = mOptions.msgs.msgEndTimeRestart;
                colorMessge = 1;
            }
            $eXeDesafio.gameOver(ds, instance);
            $('#desafioStartGameDiv-' + instance).hide();
            $eXeDesafio.showMessage(colorMessge, message, instance);
        } else {
            $eXeDesafio.startGame(instance, mOptions.typeQuestion, mOptions.activeChallenge);
        }
    },
    startGame: function (instance, type, numberButton) {
        var mOptions = $eXeDesafio.options[instance];
        if (mOptions.gameStarted) {
            return;
        };
        var imgDesafio = "desafioIcon0.png";
        imgDesafio = "url(" + $eXeDesafio.idevicePath + imgDesafio + ") no-repeat 0 0";
        $('desafioDesafio-' + instance).css({
            "background": imgDesafio
        });
        $('#desafioDescription-' + instance).show();
        $('#desafioTitle-' + instance).show();
        mOptions.obtainedClue = false;
        $('#desafioShowClue-' + instance).hide();
        $('#desafioPShowClue-' + instance).text("");
        $('#desafioMultimedia-' + instance).hide();
        $('#desafioStartGameDiv-' + instance).hide();
        mOptions.gameActived = false;
        mOptions.gameStarted = false;
        $eXeDesafio.uptateTime(0, instance);
        $('#desafioGamerOver-' + instance).hide();
        if (type == 0) {
            var message = mOptions.msgs.msgReadTime;
            if (mOptions.solvedsChallenges.length >= mOptions.challengesGame.length) {
                var message = mOptions.msgs.msgChallengesAllCompleted;
            }
            $eXeDesafio.showDesafio(instance);
            $eXeDesafio.showMessage(2, message, instance);
       } else if (type == 1) {
            $eXeDesafio.showChallenge(numberButton, instance);

        }
        mOptions.counterClock = setInterval(function () {
            if (mOptions.gameStarted) {
                mOptions.counter--;
                $eXeDesafio.uptateTime(mOptions.counter, instance);
                if (mOptions.counter <= 0) {
                    $eXeDesafio.gameOver(1, instance);
                }
            }

        }, 1000);

        mOptions.gameStarted = true;
        mOptions.gameActived = true;
        $eXeDesafio.saveDataStorage(instance);
    },
    uptateTime: function (tiempo, instance) {
        var mTime = $eXeDesafio.getTimeToString(tiempo);
        $('#desafioPTime-' + instance).text(mTime);
    },
    getTimeToString: function (iTime) {
        var mHours = Math.floor(parseInt(iTime) / 3600);
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mHours < 10 ? "0" + mHours : mHours) + ":" + (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
    gameOver: function (type, instance) {
        var mOptions = $eXeDesafio.options[instance];
        mOptions.gameStarted = false;
        mOptions.gameActived = false;
        clearInterval(mOptions.counterClock);
        $('#desafioTitle-' + instance).hide();
        $('#desafioDescription-' + instance).hide();
        $('#desafioSolutionDiv-' + instance).hide();
        $('#desafioMultimedia-' + instance).show();
        $('#desafioCover-' + instance).hide();
        $('#desafioImagen-' + instance).hide();
        $('#desafioFeedBacks-' + instance).hide();

        var message = type === 0 ? mOptions.msgs.msgDesafioSolved : mOptions.msgs.msgEndTime;
        $eXeDesafio.showMessage(2, message, instance);
        $eXeDesafio.showScoreGame(type, instance);
        //$('#desafioStartGame-' + instance).text(mOptions.msgs.msgNewGame);
        //$('#desafioStartGameDiv-' + instance).show();
        mOptions.gameOver = true;
        mOptions.endGame = true;
    },

    getRetroFeedMessages: function (iHit, instance) {
        var msgs = $eXeDesafio.options[instance].msgs;
        var sMessages = iHit ? msgs.msgSuccesses : msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },
    answerChallenge: function (instance) {
        var mOptions = $eXeDesafio.options[instance],
            challengeGame = mOptions.challengesGame[mOptions.activeChallenge],
            active = mOptions.activeChallenge,
            answord = $('#desafioSolution-' + instance).val().toUpperCase(),
            solution = "",
            message = "",
            typeMessage = 0;
        answord = answord.replace(/\s+/g, " ").trim();
        if (!mOptions.gameStarted) {
            return;
        }
        if (answord.length == 0) {
            $eXeDesafio.showMessage(1, mOptions.msgs.msgIndicateWord, instance);
            return;
        }
        if (mOptions.typeQuestion == 0) {
            if ($eXeDesafio.checkWord(mOptions.desafioSolution,answord)) {
                message = $eXeDesafio.getRetroFeedMessages(true, instance) +  mOptions.msgs.msgDesafioSolved1;
                typeMessage = 1;
                mOptions.desafioSolved = true;
                $eXeDesafio.saveDataStorage(instance);
                $eXeDesafio.gameOver(0, instance);
                return;
            } else {
                message = $eXeDesafio.getRetroFeedMessages(false, instance) + mOptions.msgs.msgSolutionError;
                $('#desafioSolution-' + instance).val('');
                typeMessage = 0;
            }
        } else {
              if ($eXeDesafio.checkWord(challengeGame.solution,answord)) {
                typeMessage = 2;
                mOptions.stateChallenges[active].solved = 1;
                mOptions.solvedsChallenges.push(active);
                if (mOptions.desafioType == 0) {
                    if (active < mOptions.challengesGame.length - 1) {
                        message = $eXeDesafio.getRetroFeedMessages(true, instance) +  mOptions.msgs.msgChallengeSolved;
                        $eXeDesafio.showChallenge(active,instance);
                    } else {
                        $eXeDesafio.showDesafio(instance);
                        message = $eXeDesafio.getRetroFeedMessages(true, instance) +  mOptions.msgs.msgChallengesAllCompleted;;
                        $('#desafioSolution-' + instance).val('');
                    }

                } else if (mOptions.desafioType == 1) {
                    if (mOptions.solvedsChallenges.length  >= mOptions.challengesGame.length) {
                        $eXeDesafio.showDesafio(instance);
                        message = $eXeDesafio.getRetroFeedMessages(true, instance) +  mOptions.msgs.msgChallengesAllCompleted; 
                        $('#desafioSolution-' + instance).val('');
                    } else {
                        $eXeDesafio.showChallenge(active,instance);
                        message = $eXeDesafio.getRetroFeedMessages(true, instance) + mOptions.msgs.msgChallengeSolved;
                    }
                }
                $eXeDesafio.saveDataStorage(instance);
            } else {
                message = $eXeDesafio.getRetroFeedMessages(false, instance) + mOptions.msgs.msgSolutionCError;
                typeMessage = 1;
                $('#desafioSolution-' + instance).val('');
            }
        }

        $eXeDesafio.showMessage(typeMessage, message, instance);


    },
    showMessageAlert: function (tmsg) {
        window.alert(tmsg)
    },
    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeDesafio.borderColors.red, $eXeDesafio.borderColors.green, $eXeDesafio.borderColors.blue, $eXeDesafio.borderColors.yellow];
        color = colors[type];
        $("#desafioPInformation-" + instance).text(message);
        $("#desafioPInformation-" + instance).css({
            'color': color,
            'font-weight': 'bold',
            'font-size': $eXeDesafio.fontSize
        });
    }
}
$(function () {

    $eXeDesafio.init();
});