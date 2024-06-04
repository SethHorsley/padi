/*! -- File: test.js ( Input 0 ) -- */
var DKI;
DKI || (DKI = {});
DKI.TestQuestion = (function () {
  var a = $(document.body).data("singlepage") ? !0 : !1;
  480 >= screen.availWidth || $(document.body).width();
  var c = {
      submit: function (b, f) {
        var d = !1;
        "undefined" != typeof dataStorage &&
          dataStorage.currentModule.forceTestEnd &&
          (d = dataStorage.currentModule.forceTestEnd);
        if (this.submitted) {
          if (
            !a &&
            !this.isPracticeQuestion &&
            settings.enableTimerQuestions &&
            d
          )
            return $(document).trigger(DKI.Events.TestQuestion.forceEnd), !1;
          $(document).trigger(DKI.Events.TestQuestion.nextClicked);
          return null;
        }
        this.submitted = !0;
        this.getOptions();
        b && (b.preventDefault(), b.stopPropagation());
        if (c.overMaxOptions.call(this))
          return (
            alert(
              this.strings.tstchoicesLabel1 +
                " " +
                this.maxSelections +
                " " +
                this.strings.tstchoicesLabel2,
            ),
            (this.submitted = !1)
          );
        if (
          !this.hasSelection.call(this) &&
          (!settings.enableTimerQuestions ||
            (settings.enableTimerQuestions && !d)) &&
          !confirm(this.strings.confirmQuestionNoSelection)
        )
          return (this.submitted = !1);
        this.submitButton.unbind();
        f = f ? f : 0;
        this.numAttempts++;
        if (a || this.isPracticeQuestion)
          (f = c.scorePreview.call(this, f)), this.setScore(f);
        else {
          f = c.scoreExport.call(this, f, d);
          if (settings.enableTimerQuestions && d)
            return $(document).trigger(DKI.Events.TestQuestion.forceEnd), !1;
          $(document).trigger(DKI.Events.TestQuestion.exportSubmitted);
        }
        100 == f &&
          ($(this.pageContainer).trigger(DKI.Events.TestQuestion.correct),
          this.numAttempts < this.question.attempts &&
            $(this.pageContainer).trigger(
              DKI.Events.TestQuestion.attemptSubmitted,
            ),
          (this.numAttempts = this.question.attempts));
        this.numAttempts == this.question.attempts
          ? ($(this.pageContainer).trigger(DKI.Events.TestQuestion.submitted),
            0 >= f
              ? $(this.pageContainer).trigger(DKI.Events.TestQuestion.incorrect)
              : 100 > f &&
                $(this.pageContainer).trigger(
                  DKI.Events.TestQuestion.partiallyCorrect,
                ))
          : ($(this.pageContainer).trigger(
              DKI.Events.TestQuestion.attemptSubmitted,
            ),
            0 >= f
              ? $(this.pageContainer).trigger(
                  DKI.Events.TestQuestion.attemptIncorrect,
                )
              : 100 > f &&
                $(this.pageContainer).trigger(
                  DKI.Events.TestQuestion.attemptPartiallyCorrect,
                ));
        return !1;
      },
      overMaxOptions: function () {
        var b = !1,
          a = 0;
        if (2 == this.questionType || 3 == this.questionType) {
          for (var c = this.getOptions(), e = 0; e < c.length; e++)
            1 == c[e].value().checked && a++;
          a > this.maxSelections && (b = !0);
        }
        return b;
      },
      atMaxOptions: function () {
        var b = !1,
          a = 0;
        if (2 == this.questionType || 3 == this.questionType) {
          for (var c = this.getOptions(), e = 0; e < c.length; e++) {
            var d = $("input", c[e].wrapper);
            d.attr("attr-checked") &&
              "true" == d.attr("attr-checked").toString() &&
              a++;
          }
          a == this.maxSelections && (b = !0);
        }
        return b;
      },
      showDefaultSubmit: function () {
        var b = this;
        contentApi.showPopup({
          html:
            '\x3cbutton role\x3d"button" tabindex\x3d"1" class\x3d"btn btn-primary btn-block dki-submit-button"\x3e' +
            DKI.strings.runtime.buttonLabelSubmit +
            "\x3c/button\x3e",
          effect: "fade",
          style: "default",
          autoFocus: !1,
          popupType: {
            mod: "botRight dki-submit-button",
            modal: !1,
            type: "notification",
          },
          id: "dki-submit-" + this.question.id,
          tabContent: !1,
          role: "application",
          afterShow: function () {
            b.settings.responsive &&
              $(b.pageContainer).css(
                "padding-bottom",
                $("#action_popup_dki-submit-" + b.question.id).height(),
              );
            b.submitButton = $(
              "#action_popup_dki-submit-" +
                b.question.id +
                " .dki-submit-button",
            );
            b.submitButton.on(settings.clickEvent, function () {
              contentApi.submitQuestion();
            });
            b.positionSubmitButton();
          },
        });
      },
      scorePreview: function (b) {
        var f = this.getOptions(),
          d = this.getCorrectCount(),
          e = 0,
          h = 0,
          g;
        b = "undefined" === typeof b ? 0 : b;
        var m = !1;
        if (
          ("pre" == this.prePost && this.behaviour.reviewPreAnswers) ||
          ("post" == this.prePost && this.behaviour.reviewPostAnswers)
        )
          m = !0;
        for (var l = 0; l < f.length; l++)
          (g = f[l].score()),
            1 === g ? e++ : -1 === g && h++,
            f[l].value(),
            c.showCorrectAnswers.call(this) && f[l].showCorrect(m);
        b = this.calculate(d, e, h, b);
        !this.isPracticeQuestion &&
          a &&
          $(this.pageContainer).trigger(
            DKI.Events.TestQuestion.questionInReview,
          );
        l = $(
          ".dki-questionBody-element .dki-element-content",
          this.pageContainer,
        );
        d = {
          type: this.questionType,
          body: l.text(),
          latency: new Date().getTime() - this.startTime,
          options: [],
          data: this.getData(),
        };
        for (l = 0; l < f.length; l++) d.options[l] = f[l].value();
        "undefined" == typeof dataStorage ||
          this.inReview ||
          $(this.player.dataStorage).trigger(
            DKI.DataStorage.events.questionScored,
            {
              question: dataStorage.currentPage.question,
              questionObject: d,
              score: b,
              test: this,
            },
          );
        $(".dki-authoring-element", this.pageContainer)
          .has(".correct, .incorrect, .multiChoiceCorrect")
          .css("zIndex", 1e5);
        return b;
      },
      scoreExport: function (b, a) {
        for (
          var c = this.getOptions(),
            e = $(
              ".dki-questionBody-element .dki-element-content",
              this.pageContainer,
            ),
            e = {
              type: this.questionType,
              body: e.text(),
              latency: new Date().getTime() - this.startTime,
              options: [],
              data: this.getData(),
            },
            d = 0;
          d < c.length;
          d++
        )
          (e.options[d] = c[d].value()),
            this.behaviour.IncludeQuestionNumbering &&
              (e.options[d].text =
                $(".optionNumber", c[d].wrapper).text() + e.options[d].text);
        return (b = this.player.dataStorage.submitCurrentQuestion(
          e,
          b,
          a,
          this,
        ));
      },
      showCorrectFeedback: function () {
        return c.doShowFeedback.call(this, "correct");
      },
      showIncorrectFeedback: function () {
        return c.doShowFeedback.call(this, "incorrect");
      },
      showIncorrectAttemptFeedback: function () {
        return c.doShowFeedback.call(this, "incorrectAttempt");
      },
      showPartialFeedback: function () {
        return c.doShowFeedback.call(this, "partial");
      },
      showPartialAttemptFeedback: function () {
        return c.doShowFeedback.call(this, "partialAttempt");
      },
      doShowFeedback: function (b) {
        var f =
            this.question.parameters.feedback[
              3 == this.question.type ? "incorrect" : b
            ],
          d = this.question.parameters.feedback.popup;
        "true" == d.use_course_default.toString() &&
          (d = contentApi.getDefaultFeedbackPopup());
        var e = this,
          h = "",
          h = f.useDefault
            ? h + contentApi.getDefaultFeedbackText(b)
            : h + f.text,
          f = this.getOptionFeedback();
        "" != f && ("" != h && (h += "\x3chr/\x3e"), (h += f));
        var g = function () {
            8 != e.question.type &&
              (e.showInlineFeedback(),
              h &&
                contentApi.showPopup({
                  ariaLabel: DKI.strings.doc["Question feedback header"],
                  html: h,
                  title: "",
                  effect: "fade",
                  style: (function () {
                    var a = "success";
                    if ("incorrect" == b || "incorrectAttempt" == b)
                      a = "danger";
                    else if ("partial" == b || "partialAttempt" == b)
                      a = "warning";
                    return a;
                  })(),
                  autoFocus: !0,
                  popupType: {
                    mod: d.mod,
                    modal: d.modal,
                    type: d.type,
                  },
                  id: "question_" + e.question.id + "_feedback",
                  addClass: "DKI-questionFeedback",
                  returnFocus: $("button.dki-try-again")[0]
                    ? $("button.dki-try-again")[0]
                    : document.activeElement,
                }));
          },
          f = function () {
            for (
              var a = this.page.actions,
                c = function (b) {
                  if ("api" == b.type) {
                    if (
                      ((b = b.parameters.method),
                      "hideForward" == b ||
                        "hideBack" == b ||
                        "hideBoth" == b ||
                        "showForward" == b ||
                        "showBack" == b ||
                        "showBoth" == b)
                    )
                      return !0;
                  } else if (
                    "setVariable" == b.type ||
                    "sendXAPIStatement" == b.type
                  )
                    return !0;
                  return !1;
                },
                d = 0;
              d < a.length;
              d++
            ) {
              if (a[d].trigger == DKI.Events.TestQuestion.submitted && !c(a[d]))
                return !0;
              if (a[d].trigger == DKI.Events.TestQuestion.correct && !c(a[d])) {
                if ("correct" == b) return !0;
              } else if (
                a[d].trigger == DKI.Events.TestQuestion.incorrect &&
                !c(a[d])
              ) {
                if ("incorrect" == b) return !0;
              } else if (
                a[d].trigger != DKI.Events.TestQuestion.partiallyCorrect ||
                c(a[d])
              ) {
                if (
                  a[d].trigger == DKI.Events.TestQuestion.attemptSubmitted &&
                  !c(a[d])
                )
                  return !0;
                if (
                  a[d].trigger == DKI.Events.TestQuestion.attemptIncorrect &&
                  !c(a[d])
                ) {
                  if ("incorrectAttempt" == b) return !0;
                } else if (
                  a[d].trigger ==
                    DKI.Events.TestQuestion.attemptPartiallyCorrect &&
                  !c(a[d]) &&
                  "partialAttempt" == b
                )
                  return !0;
              } else if ("partial" == b) return !0;
            }
            return !1;
          },
          m = function () {
            !e.inReview &&
            e.isPracticeQuestion &&
            e.question.show_try_again &&
            e.numAttempts < e.question.attempts &&
            ("incorrectAttempt" == b || "partialAttempt" == b)
              ? 8 !== e.questionType &&
                contentApi.showPopup({
                  html:
                    '\x3cspan class\x3d"remainingAttempts" tabindex\x3d"1"\x3e' +
                    DKI.strings.runtime.txtRemainingAttempts +
                    " " +
                    (e.question.attempts - e.numAttempts) +
                    '\x3c/span\x3e\x3cbutton class\x3d"btn btn-primary dki-try-again" tabindex\x3d"1" style\x3d"float: right;" onclick\x3d"contentApi.tryAgain();" data-dismiss\x3d"alert"\x3e' +
                    DKI.strings.runtime.testTryAgain +
                    "\x3c/button\x3e",
                  effect: "fade",
                  style: "default",
                  autoFocus: !0,
                  popupType: {
                    mod: "botRight dki-try-again",
                    modal: !1,
                    type: "notification",
                  },
                  id: "dki-try-again-" + e.question.id,
                  returnFocus: document.activeElement,
                  tabContent: !1,
                  role: "application",
                  afterShow: function () {
                    e.tryAgainButton = $(
                      "#content_dki-try-again-" +
                        e.question.id +
                        " .dki-try-again",
                    );
                    e.positionSubmitButton();
                    $(
                      "#content_dki-try-again-" +
                        e.question.id +
                        " .remainingAttempts",
                    ).focus();
                  },
                })
              : (e.submitButton.text(e.strings.buttonLabelNext),
                e.submitButton.off(),
                e.submitButton.on(
                  e.player.settings.clickEvent,
                  $.proxy(function (b) {
                    e.submitButton.unbind(b);
                    e.submitButton.hide();
                    b.preventDefault();
                    b.stopPropagation();
                    e.page.isStandalonePage
                      ? $.fancybox.close()
                      : $(document).trigger(
                          DKI.Events.TestQuestion.nextClicked,
                        );
                  }, e),
                ),
                (7 == e.questionType || (8 == e.questionType && !e.inReview)) &&
                  e.submitButton.trigger(e.player.settings.clickEvent));
          };
        if (c.showFeedback.call(this)) {
          if ("" != h || this.hasInlineFeedback())
            setTimeout(m, 100),
              this.inReview
                ? setTimeout(function () {
                    g();
                  }, 500)
                : g();
          else {
            if (8 == e.question.type) return setTimeout(m, 100), !1;
            if (
              e.inReview ||
              e.isPracticeQuestion ||
              a ||
              dataStorage.currentModule.forceTestEnd ||
              f.call(this)
            )
              setTimeout(m, 100);
            else
              return (
                $(document).trigger(DKI.Events.TestQuestion.nextClicked), !1
              );
          }
          return !0;
        }
        8 == e.question.type
          ? setTimeout(m, 100)
          : e.inReview ||
              e.isPracticeQuestion ||
              a ||
              dataStorage.currentModule.forceTestEnd ||
              f.call(this)
            ? setTimeout(m, 100)
            : $(document).trigger(DKI.Events.TestQuestion.nextClicked);
        return !1;
      },
      showFeedback: function () {
        return !this.behaviour || this.preview
          ? !0
          : this.inReview ||
              (!this.behaviour.displayQuestionFeedback &&
                !this.isPracticeQuestion)
            ? this.inReview
              ? "pre" == this.prePost && this.behaviour.reviewPreFeedback
                ? !0
                : "post" == this.prePost && this.behaviour.reviewPostFeedback
                  ? !0
                  : !1
              : !1
            : !0;
      },
      showCorrectAnswers: function () {
        return this.isPracticeQuestion || (this.behaviour && !this.preview)
          ? this.inReview
            ? !0
            : !1
          : !0;
      },
    },
    d = function (b, d, k, e) {
      var h = function (b) {
        var a = $("label[for\x3d'" + b.attr("id") + "']", d.pageContainer);
        $(".content input[type\x3d'radio']", d.pageContainer).each(
          function (a, c) {
            $("label[for\x3d'" + c.id + "']").removeClass("checked");
            c.id != b.attr("id") && $(c).prop("checked", !1);
          },
        );
        $(".input-group", d.pageContainer).removeClass("checked");
        b.prop("checked")
          ? (a.addClass("checked"),
            a.closest(".input-group").addClass("checked"))
          : a.removeClass("checked");
        $(".input-group input:checked", d.pageContainer).each(function () {
          $(this).closest(".input-group").addClass("checked");
        });
      };
      this.question = k;
      this.player = b;
      this.strings = b.strings;
      this.page = d;
      this.behaviour = this.player.behaviour;
      this.inReview = this.player.inReview;
      this.settings = this.player.settings;
      this.submitted = !1;
      this.prePost = "";
      this.pageContainer = this.page.pageContainer;
      this.questionElement = $(
        "div[data-pagetype\x3d'question']",
        this.pageContainer,
      );
      this.questionType = parseInt(
        this.questionElement.attr("data-questiontype"),
        10,
      );
      this.startTime = null;
      this.submitButton = $(".dki-submit-button");
      this.scoreDisplay = $(".questionScoreDisplay");
      this.maxSelections = parseInt(
        this.questionElement.attr("data-max-selections"),
        10,
      );
      this.freeFormMaxLength = 4e3;
      this.numAttempts = 0;
      this.isPracticeQuestion = e;
      this.isSinglePage = a;
      "undefined" !== typeof scormAPI &&
        "SCORM" == scormAPI.strLMSStandard &&
        (this.freeFormMaxLength = 255);
      this.getData = function () {};
      this.onShowReview = function (b) {
        b();
      };
      this.showInlineFeedback = function () {};
      this.hasInlineFeedback = function () {
        return !1;
      };
      switch (this.questionType) {
        case 1:
          this.getCorrectCount = $.proxy(
            DKI.TestQuestion.TrueFalseQuestion.getCorrectCount,
            this,
          );
          this.getOptions = $.proxy(
            DKI.TestQuestion.TrueFalseQuestion.getOptions,
            this,
          );
          this.hasSelection = $.proxy(
            DKI.TestQuestion.TrueFalseQuestion.hasSelection,
            this,
          );
          this.scoreOption = $.proxy(
            DKI.TestQuestion.TrueFalseQuestion.scoreOption,
            this,
          );
          this.calculate = $.proxy(
            DKI.TestQuestion.TrueFalseQuestion.calculate,
            this,
          );
          this.getOptionFeedback = $.proxy(
            DKI.TestQuestion.TrueFalseQuestion.getOptionFeedback,
            this,
          );
          $(".trueOption_label", this.pageContainer).text(
            this.strings.trueOptionLabel,
          );
          $(".falseOption_label", this.pageContainer).text(
            this.strings.falseOptionLabel,
          );
          break;
        case 2:
          this.getCorrectCount = $.proxy(
            DKI.TestQuestion.MultipleChoiceQuestion.getCorrectCount,
            this,
          );
          this.getOptions = $.proxy(
            DKI.TestQuestion.MultipleChoiceQuestion.getOptions,
            this,
          );
          this.hasSelection = $.proxy(
            DKI.TestQuestion.MultipleChoiceQuestion.hasSelection,
            this,
          );
          this.scoreOption = $.proxy(
            DKI.TestQuestion.MultipleChoiceQuestion.scoreOption,
            this,
          );
          this.calculate = $.proxy(
            DKI.TestQuestion.MultipleChoiceQuestion.calculate,
            this,
          );
          this.getOptionFeedback = $.proxy(
            DKI.TestQuestion.MultipleChoiceQuestion.getOptionFeedback,
            this,
          );
          this.randomizeOptions = $.proxy(
            DKI.TestQuestion.MultipleChoiceQuestion.randomizeOptions,
            this,
          );
          this.inReview || this.randomizeOptions();
          break;
        case 3:
          this.getCorrectCount = $.proxy(
            DKI.TestQuestion.FreeFormQuestion.getCorrectCount,
            this,
          );
          this.getOptions = $.proxy(
            DKI.TestQuestion.FreeFormQuestion.getOptions,
            this,
          );
          this.hasSelection = $.proxy(
            DKI.TestQuestion.FreeFormQuestion.hasSelection,
            this,
          );
          this.scoreOption = $.proxy(
            DKI.TestQuestion.FreeFormQuestion.scoreOption,
            this,
          );
          this.calculate = $.proxy(
            DKI.TestQuestion.FreeFormQuestion.calculate,
            this,
          );
          this.getOptionFeedback = $.proxy(
            DKI.TestQuestion.FreeFormQuestion.getOptionFeedback,
            this,
          );
          break;
        case 4:
          this.getCorrectCount = $.proxy(
            DKI.TestQuestion.FillBlanksQuestion.getCorrectCount,
            this,
          );
          this.getOptions = $.proxy(
            DKI.TestQuestion.FillBlanksQuestion.getOptions,
            this,
          );
          this.hasSelection = $.proxy(
            DKI.TestQuestion.FillBlanksQuestion.hasSelection,
            this,
          );
          this.scoreOption = $.proxy(
            DKI.TestQuestion.FillBlanksQuestion.scoreOption,
            this,
          );
          this.calculate = $.proxy(
            DKI.TestQuestion.FillBlanksQuestion.calculate,
            this,
          );
          this.getOptionFeedback = $.proxy(
            DKI.TestQuestion.FillBlanksQuestion.getOptionFeedback,
            this,
          );
          break;
        case 5:
          this.getCorrectCount = $.proxy(
            DKI.TestQuestion.MultiplePulldownQuestion.getCorrectCount,
            this,
          );
          this.getOptions = $.proxy(
            DKI.TestQuestion.MultiplePulldownQuestion.getOptions,
            this,
          );
          this.hasSelection = $.proxy(
            DKI.TestQuestion.MultiplePulldownQuestion.hasSelection,
            this,
          );
          this.scoreOption = $.proxy(
            DKI.TestQuestion.MultiplePulldownQuestion.scoreOption,
            this,
          );
          this.calculate = $.proxy(
            DKI.TestQuestion.MultiplePulldownQuestion.calculate,
            this,
          );
          this.getOptionFeedback = $.proxy(
            DKI.TestQuestion.MultiplePulldownQuestion.getOptionFeedback,
            this,
          );
          this.randomizeOptions = function () {
            $(
              ".dki-multiPulldownOption-element select",
              this.pageContainer,
            ).each(function () {
              for (var b = [], a = this.options.length - 1; 0 <= a; a--)
                "" != $(this.options[a]).html() && b.push(this.options[a]),
                  this.remove(a);
              for (a = b.length; a--; ) {
                var c = Math.floor(Math.random() * (a + 1)),
                  d = b[a];
                b[a] = b[c];
                b[c] = d;
              }
              this.innerHTML = "";
              if (dkiUA.ie && 8 >= dkiUA.ieVersion)
                for (this.add(new Option("", "")), a = 0; a < b.length; a++)
                  this.add(b[a], a + 1);
              else
                for (
                  this.add(new Option("", ""), null), a = 0;
                  a < b.length;
                  a++
                )
                  this.add(b[a], null);
              this.selectedIndex = 0;
            });
          };
          this.randomizeOptions();
          break;
        case 6:
          this.getCorrectCount = $.proxy(
            DKI.TestQuestion.DragDropQuestion.getCorrectCount,
            this,
          );
          this.getOptions = $.proxy(
            DKI.TestQuestion.DragDropQuestion.getOptions,
            this,
          );
          this.hasSelection = $.proxy(
            DKI.TestQuestion.DragDropQuestion.hasSelection,
            this,
          );
          this.scoreOption = $.proxy(
            DKI.TestQuestion.DragDropQuestion.scoreOption,
            this,
          );
          this.calculate = $.proxy(
            DKI.TestQuestion.DragDropQuestion.calculate,
            this,
          );
          this.getOptionFeedback = $.proxy(
            DKI.TestQuestion.DragDropQuestion.getOptionFeedback,
            this,
          );
          break;
        case 7:
          this.getCorrectCount = $.proxy(
            DKI.TestQuestion.customQuestion.getCorrectCount,
            this,
          );
          this.getOptions = $.proxy(
            DKI.TestQuestion.customQuestion.getOptions,
            this,
          );
          this.hasSelection = $.proxy(
            DKI.TestQuestion.customQuestion.hasSelection,
            this,
          );
          this.scoreOption = $.proxy(
            DKI.TestQuestion.customQuestion.scoreOption,
            this,
          );
          this.calculate = $.proxy(
            DKI.TestQuestion.customQuestion.calculate,
            this,
          );
          this.getOptionFeedback = $.proxy(
            DKI.TestQuestion.customQuestion.getOptionFeedback,
            this,
          );
          break;
        case 8:
          this.getCorrectCount = $.proxy(
            DKI.TestQuestion.captureQuestion.getCorrectCount,
            this,
          );
          this.getOptions = $.proxy(
            DKI.TestQuestion.captureQuestion.getOptions,
            this,
          );
          this.hasSelection = $.proxy(
            DKI.TestQuestion.captureQuestion.hasSelection,
            this,
          );
          this.scoreOption = $.proxy(
            DKI.TestQuestion.captureQuestion.scoreOption,
            this,
          );
          this.calculate = $.proxy(
            DKI.TestQuestion.captureQuestion.calculate,
            this,
          );
          this.getOptionFeedback = $.proxy(
            DKI.TestQuestion.captureQuestion.getOptionFeedback,
            this,
          );
          this.getData = $.proxy(
            DKI.TestQuestion.captureQuestion.getData,
            this,
          );
          this.onShowReview = $.proxy(
            DKI.TestQuestion.captureQuestion.onShowReview,
            this,
          );
          break;
        case 9:
          this.getCorrectCount = $.proxy(
            DKI.TestQuestion.imageMapQuestion.getCorrectCount,
            this,
          );
          this.getOptions = $.proxy(
            DKI.TestQuestion.imageMapQuestion.getOptions,
            this,
          );
          this.hasSelection = $.proxy(
            DKI.TestQuestion.imageMapQuestion.hasSelection,
            this,
          );
          this.scoreOption = $.proxy(
            DKI.TestQuestion.imageMapQuestion.scoreOption,
            this,
          );
          this.calculate = $.proxy(
            DKI.TestQuestion.imageMapQuestion.calculate,
            this,
          );
          this.getOptionFeedback = $.proxy(
            DKI.TestQuestion.imageMapQuestion.getOptionFeedback,
            this,
          );
          this.getData = $.proxy(
            DKI.TestQuestion.imageMapQuestion.getData,
            this,
          );
          this.onShowReview = $.proxy(
            DKI.TestQuestion.imageMapQuestion.onShowReview,
            this,
          );
          this.showInlineFeedback = $.proxy(
            DKI.TestQuestion.imageMapQuestion.showInlineFeedback,
            this,
          );
          this.hasInlineFeedback = $.proxy(
            DKI.TestQuestion.imageMapQuestion.hasInlineFeedback,
            this,
          );
          break;
        case 10:
          (this.getCorrectCount = $.proxy(
            DKI.TestQuestion.scenarioQuestion.getCorrectCount,
            this,
          )),
            (this.getOptions = $.proxy(
              DKI.TestQuestion.scenarioQuestion.getOptions,
              this,
            )),
            (this.hasSelection = $.proxy(
              DKI.TestQuestion.scenarioQuestion.hasSelection,
              this,
            )),
            (this.scoreOption = $.proxy(
              DKI.TestQuestion.scenarioQuestion.scoreOption,
              this,
            )),
            (this.calculate = $.proxy(
              DKI.TestQuestion.scenarioQuestion.calculate,
              this,
            )),
            (this.getOptionFeedback = $.proxy(
              DKI.TestQuestion.scenarioQuestion.getOptionFeedback,
              this,
            )),
            (this.getData = $.proxy(
              DKI.TestQuestion.scenarioQuestion.getData,
              this,
            )),
            (this.onShowReview = $.proxy(
              DKI.TestQuestion.scenarioQuestion.onShowReview,
              this,
            )),
            (this.showDefaultSubmit = $.proxy(c.showDefaultSubmit, this));
      }
      this.player.questionPage = this;
      var g = this;
      $(this.pageContainer).on(
        this.settings.clickEvent,
        ".dki-trueFalse-selector, .dki-multiChoice-selector, .dki-multiChoiceOption-element .dki-element-anchor, .dki-trueFalseOption-element .dki-element-anchor, .dki-multiChoiceOption-element input, .dki-multiChoiceOption-element label, .dki-trueFalseOption-element input",
        function (b) {
          var a = $(this).parent().find("input");
          if (a.prop("disabled"))
            return b.stopPropagation(), b.preventDefault(), !1;
          var d = $("label[for\x3d'" + a.attr("id") + "']", g.pageContainer);
          if (
            !d.hasClass("checked") &&
            c.atMaxOptions.call(g) &&
            "radio" != a.attr("type")
          )
            return (
              alert(
                g.strings.tstchoicesLabel1 +
                  " " +
                  g.maxSelections +
                  " " +
                  g.strings.tstchoicesLabel2,
              ),
              b.stopPropagation(),
              b.preventDefault(),
              a.prop(
                "checked",
                a.attr("attr-checked") &&
                  "true" == a.attr("attr-checked").toString(),
              ),
              !1
            );
          a.attr("attr-checked") && "true" == a.attr("attr-checked").toString()
            ? "checkbox" == a.attr("type") && a.attr("attr-checked", !1)
            : a.attr("attr-checked", !0);
          a.prop(
            "checked",
            a.attr("attr-checked") &&
              "true" == a.attr("attr-checked").toString(),
          );
          h(a);
          var e = $(this).closest(".dki-authoring-element");
          $("*[tabindex]:not([tabindex\x3d'-1'])", e).focus();
          "checkbox" != a.attr("type") ||
            (a[0] != b.target && d[0] != b.target) ||
            b.stopPropagation();
        },
      );
      $(".dki-freeFormOption-element textarea").attr(
        "maxlength",
        this.freeFormMaxLength,
      );
      $(this.pageContainer).on(
        "keyup",
        ".dki-freeFormOption-element textarea",
        function (b) {
          b = $(this).val();
          b.length > g.freeFormMaxLength &&
            ((b = b.substr(0, g.freeFormMaxLength)), $(this).val(b));
        },
      );
      $("input", this.pageContainer).on("focus", function (b) {
        $(this).closest(".input-group-addon").addClass("focus-within");
      });
      $("input", this.pageContainer).on("blur", function (b) {
        $(".input-group-addon.focus-within").removeClass("focus-within");
      });
      for (var m in DKI.Events.TestQuestion)
        $(this.pageContainer).off(DKI.Events.TestQuestion[m]);
      $(this.pageContainer).on(DKI.Events.TestQuestion.submitted, function () {
        g.page.actionAPI.onPageEvent(DKI.Events.TestQuestion.submitted, g.page);
      });
      $(this.pageContainer).on(DKI.Events.TestQuestion.correct, function () {
        g.page.actionAPI.onPageEvent(DKI.Events.TestQuestion.correct, g.page);
      });
      $(this.pageContainer).on(DKI.Events.TestQuestion.incorrect, function () {
        g.page.actionAPI.onPageEvent(DKI.Events.TestQuestion.incorrect, g.page);
      });
      $(this.pageContainer).on(
        DKI.Events.TestQuestion.partiallyCorrect,
        function () {
          g.page.actionAPI.onPageEvent(
            DKI.Events.TestQuestion.partiallyCorrect,
            g.page,
          );
        },
      );
      $(this.pageContainer).on(
        DKI.Events.TestQuestion.attemptSubmitted,
        function () {
          g.page.actionAPI.onPageEvent(
            DKI.Events.TestQuestion.attemptSubmitted,
            g.page,
          );
        },
      );
      $(this.pageContainer).on(
        DKI.Events.TestQuestion.attemptIncorrect,
        function () {
          g.page.actionAPI.onPageEvent(
            DKI.Events.TestQuestion.attemptIncorrect,
            g.page,
          );
        },
      );
      $(this.pageContainer).on(
        DKI.Events.TestQuestion.attemptPartiallyCorrect,
        function () {
          g.page.actionAPI.onPageEvent(
            DKI.Events.TestQuestion.attemptPartiallyCorrect,
            g.page,
          );
        },
      );
      $(this.pageContainer).on(
        DKI.Events.TestQuestion.questionInReview,
        function () {
          g.page.actionAPI.onPageEvent(
            DKI.Events.TestQuestion.questionInReview,
            g.page,
          );
        },
      );
      $(document).on(DKI.Events.TestQuestion.retry, function () {
        g.page.actionAPI.onPageEvent(DKI.Events.TestQuestion.retry, g.page);
      });
      $.each(this.page, function (b) {
        "undefined" == typeof g[b] &&
          DKI.isFunction(this) &&
          (g[b] = $.proxy(g.page[b], g.page));
      });
    };
  DKI.applyIf(d.prototype, {
    setPrePost: function (b) {
      this.prePost = b ? b : "post";
    },
    setScore: function (b, a, d) {
      b = void 0 !== b && null !== b ? parseFloat(b, 10) : 0;
      var e = this.numAttempts == this.question.attempts;
      7 !== this.questionType &&
        (b =
          0 >= b
            ? e
              ? c.showIncorrectFeedback.call(this)
              : c.showIncorrectAttemptFeedback.call(this)
            : 100 === b
              ? c.showCorrectFeedback.call(this)
              : e
                ? c.showPartialFeedback.call(this)
                : c.showPartialAttemptFeedback.call(this)) &&
        $(document).trigger(DKI.Events.TestQuestion.feedbackShown);
      b = this.getOptions();
      for (e = 0; e < b.length; e++) b[e].enabled(!1);
      this.inReview &&
        ($(".questionScoreLabel").text(
          player.strings.txtScore +
            (" " != player.strings.txtScore.slice(-1) ? " " : ""),
        ),
        $(".questionScore").text(a + " / " + d + " " + this.strings.txtPoints),
        $(document.body).hasClass("phone")
          ? this.scoreDisplay.show()
          : this.scoreDisplay.fadeIn(200));
    },
    setOptions: function (b, a) {
      for (var c = this.getOptions(), d = 0; d < c.length; d++)
        c[d].value(b[d]), c[d].enabled(!1), c[d].correctResponse(a[d]);
      2 == this.questionType &&
        $(".dki-multiChoiceOption-element .multiChoiceContentWrapper").css(
          "visibility",
          "",
        );
    },
    showReview: function (b, a, d, e) {
      this.inReview = !0;
      this.numAttempts = this.question.attempts;
      this.setPrePost(b);
      this.setOptions(a, d);
      var h = 7 == this.questionType ? [e.score] : [];
      this.onShowReview(
        $.proxy(function () {
          c.scorePreview.apply(this, h);
          this.setScore(e.score, e.points, e.weight);
          $(this.pageContainer).trigger(
            DKI.Events.TestQuestion.questionInReview,
          );
          this.question.disable_submit ||
            this.settings.responsive ||
            (7 != this.questionType &&
              ($(document.body).hasClass("phone")
                ? this.submitButton.show()
                : this.submitButton.fadeIn(500)));
        }, this),
      );
    },
    showCorrectAnswers: function () {
      for (var b = this.getOptions(), a = 0; a < b.length; a++)
        b[a].showCorrect(!0);
    },
    tryAgain: function () {
      this.reset({
        doNotResetAttempts: !0,
      });
      this.tryAgainButton = null;
      $(document).trigger(DKI.Events.TestQuestion.retry);
      this.start();
    },
    submitQuestion: function (b) {
      c.submit.call(this, null, b);
    },
    start: function () {
      this.startTime = new Date().getTime();
      var b = this;
      this.page.resize();
      this.page.start();
      this.startOptions();
      !this.question.disable_submit &&
        7 != this.question.type &&
        ((10 !== this.question.type && 8 != this.question.type) ||
          this.inReview) &&
        c.showDefaultSubmit.call(this);
      6 == this.questionType &&
        ($(
          ".dki-authoring-element[data-is-draggable\x3dtrue][data-isquestionelement\x3dtrue]",
          this.pageContainer,
        ).draggable({
          revert: function (b) {
            $(this).data("draggable").originalPosition = {
              top: settings.responsive ? 0 : $(this).data("y"),
              left: settings.responsive ? 0 : $(this).data("x"),
            };
            if (b) $(this).trigger(DKI.ContentPage.events.elementDragDropped);
            else
              return (
                $(this).css("z-index", $(this).data("elementno")),
                $(this).data("reverted", !0),
                $(this).trigger(DKI.ContentPage.events.elementDragReverted),
                !0
              );
          },
          drag: function (b, a) {
            b = $(this).data("initialPageYOffset");
            a.position.top += b;
            DKI.utility.dragFix(a);
          },
          start: function (b, a) {
            (1 != $(this).data("reverted") &&
              "undefined" != typeof $(this).data("reverted")) ||
              $(this).data("origPosition", $(this).position());
            $(this).parent().css("position", "static");
            $(this).data("reverted", !1);
            b = $(this).data("title");
            "" == b && (b = $(this).text());
            $(this).data("dropData", {
              id: $(this).data("dragdropid"),
              elementId: $(this).data("id"),
              title: b,
              target: {
                id: null,
                title: "No Target",
              },
              x: $(this).data("x"),
              y: $(this).data("y"),
            });
            $(this).data(
              "initialPageYOffset",
              document.documentElement.scrollTop,
            );
            $(this).trigger(DKI.ContentPage.events.elementDragStarted);
            $(document).trigger(DKI.Events.TestQuestion.dragStarted);
          },
          stop: function (b, a) {
            $(this).data("reverted")
              ? ($(this).css("z-index", $(this).data("elementno")),
                settings.responsive &&
                  $(this).css({
                    top: "",
                    left: "",
                  }),
                ($(this).data("draggable").originalPosition = {
                  top: $(this).data("y"),
                  left: $(this).data("x"),
                }))
              : $(this).css("z-index", 1e5);
            $(this).trigger(DKI.ContentPage.events.elementDragStopped);
            $(document).trigger(DKI.Events.TestQuestion.dragStopped);
          },
          stack:
            ".dkiContentFrame.current .dki-authoring-element[data-is-droppable\x3dtrue][data-isquestionelement\x3dtrue], .fancybox-content .dki-authoring-element[data-is-droppable\x3dtrue][data-isquestionelement\x3dtrue]",
          scroll: settings.responsive,
          zIndex: 1e5,
          disabled: !1,
        }),
        $(
          ".dki-authoring-element[data-is-droppable\x3dtrue][data-isquestionelement\x3dtrue]",
          this.pageContainer,
        ).droppable({
          accept:
            ".dkiContentFrame.current .dki-authoring-element[data-is-draggable\x3dtrue][data-isquestionelement\x3dtrue], .fancybox-content .dki-authoring-element[data-is-draggable\x3dtrue][data-isquestionelement\x3dtrue]",
          tolerance: "pointer",
          out: function (b, a) {
            $(this).trigger(DKI.ContentPage.events.elementDropOut);
          },
          over: function (b, a) {
            $(this).trigger(DKI.ContentPage.events.elementDropOver);
          },
          drop: function (a, d) {
            a = d.draggable.data("title");
            "" == a && (a = d.draggable.text());
            var c = $(this).data("title");
            "" == c && (c = $(this).text());
            var h;
            if (
              b.question.parameters.snapToCenter &&
              "true" == b.question.parameters.snapToCenter.toString()
            ) {
              var g = settings.scale;
              !settings.responsive &&
                d.helper.closest(".fancybox-container").length &&
                (g *= settings.claroLightboxScaling);
              if (settings.responsive) {
                h = $(this).offset();
                h.top /= g;
                h.left /= g;
                var m = d.draggable
                    .find("\x3e.dki-authoring-content-wrapper")
                    .first(),
                  l = $(this)
                    .find("\x3e.dki-authoring-content-wrapper")
                    .first(),
                  g =
                    h.top +
                    parseInt(l.css("padding-top")) +
                    (l.height() - parseInt(l.css("padding-bottom"))) / 2 -
                    m.outerHeight() / 2 -
                    (d.draggable.data("origPosition").top +
                      d.draggable.parent().offset().top +
                      parseInt(d.draggable.css("margin-top")));
                h =
                  h.left +
                  parseInt(l.css("padding-left")) +
                  (l.width() - parseInt(l.css("padding-left"))) / 2 -
                  m.outerWidth() / 2 -
                  (d.draggable.parent().offset().left +
                    parseInt(d.draggable.css("margin-left")));
              } else
                (h = $(this).position()),
                  (h.top /= g),
                  (h.left /= g),
                  (g = h.top + $(this).height() / 2 - d.draggable.height() / 2),
                  (h = h.left + $(this).width() / 2 - d.draggable.width() / 2);
              d.draggable.animate(
                {
                  top: g + "px",
                  left: h + "px",
                },
                125,
              );
              h = {
                top: g,
                left: h,
              };
            } else h = d.draggable.position();
            d.draggable.data("dropData", {
              id: d.draggable.data("dragdropid"),
              elementId: d.draggable.data("id"),
              title: a,
              target: {
                id: $(this).data("dragdropid"),
                title: c,
              },
              x: h.left,
              y: h.top,
            });
            $(this).trigger(DKI.ContentPage.events.elementDropDropped);
          },
          disabled: !1,
        }));
      8 == this.questionType && DKI.TestQuestion.captureQuestion.init(this);
      9 == this.questionType && DKI.TestQuestion.imageMapQuestion.init(this);
      10 == this.questionType && DKI.TestQuestion.scenarioQuestion.init(this);
    },
    reset: function (b) {
      b = DKI.applyIf(b, {
        doNotResetAttempts: !1,
        timeout: 0,
      });
      var a = this;
      contentApi.destroyPopup("question_" + this.question.id + "_feedback");
      contentApi.destroyPopup("dki-submit-" + this.question.id);
      contentApi.destroyPopup("dki-try-again-" + this.question.id);
      a.submitButton.hide();
      a.submitButton.unbind();
      var d = function () {
        a.submitted = !1;
        b.doNotResetAttempts || (a.numAttempts = 0);
        b.timeout = 0;
        a.page.reset(b);
        a.resetOptions();
        6 == a.questionType &&
          ($(
            ".dki-authoring-element[data-is-draggable\x3dtrue][data-isquestionelement\x3dtrue]",
            a.pageContainer,
          ).draggable("option", "disabled", !0),
          $(
            ".dki-authoring-element[data-is-droppable\x3dtrue][data-isquestionelement\x3dtrue]",
            a.pageContainer,
          ).droppable("option", "disabled", !0));
      };
      0 < b.timeout ? setTimeout(d, b.timeout) : d();
    },
    startOptions: function () {
      for (var b = this.getOptions(), a = 0; a < b.length; a++) b[a].start();
    },
    resetOptions: function () {
      for (var b = this.getOptions(), a = 0; a < b.length; a++) b[a].reset();
      2 == this.question.type && this.randomizeOptions();
    },
    onWindowResize: function () {
      this.page.onWindowResize();
      this.positionSubmitButton();
    },
    positionSubmitButton: function () {
      if (this.submitButton.is(":visible")) {
        var b = this.submitButton.closest(".notification");
        if (settings.responsive) {
          var a = $("#contentFrame").offset(),
            d =
              a.left +
              $("#contentFrame").width() -
              b.outerWidth() -
              settings.course.parameters.submitButtonOffset.right,
            c = parseInt(
              $(".bgRepeater").css("padding-bottom").split("px")[0],
              10,
            ),
            c = c + settings.course.parameters.submitButtonOffset.bottom;
          b.css({
            left: 0 > d ? 0 : d,
            bottom: c,
            right: "auto",
          });
          $("#skipToNavigation").length &&
            $("#skipToNavigation").before(b.detach());
          this.tryAgainButton &&
            ((b = this.tryAgainButton.closest(".notification")),
            (d =
              a.left +
              $("#contentFrame").width() -
              b.outerWidth() -
              settings.course.parameters.submitButtonOffset.right),
            b.css({
              left: 0 > d ? 0 : d,
              bottom: c,
              right: "auto",
            }),
            $("#skipToNavigation").length &&
              $("#skipToNavigation").before(b.detach()));
        } else
          (a = $(".bgRepeater").offset()),
            (a.top /= settings.scale),
            (a.left /= settings.scale),
            (d =
              a.left +
              $(".bgRepeater").width() -
              settings.course.parameters.submitButtonOffset.right),
            (c =
              a.top +
              $(".bgRepeater").height() -
              settings.course.parameters.submitButtonOffset.bottom),
            (d =
              Math.min(d, window.innerWidth / settings.scale) - b.outerWidth()),
            (c =
              Math.min(c, window.innerHeight / settings.scale) -
              b.outerHeight()),
            b.css({
              top: c,
              left: d,
              bottom: "auto",
              right: "auto",
            }),
            $("#skipToNavigation").length &&
              $("#skipToNavigation").before(b.detach()),
            this.tryAgainButton &&
              ((b = this.tryAgainButton.closest(".notification")),
              (d =
                a.left +
                $(".bgRepeater").width() -
                b.outerWidth() -
                settings.course.parameters.submitButtonOffset.right),
              b.css({
                top: c,
                left: d,
                bottom: "auto",
                right: "auto",
              }),
              $("#skipToNavigation").length &&
                $("#skipToNavigation").before(b.detach()));
      }
    },
    canShowFeedback: function () {
      return c.showFeedback.call(this);
    },
    canShowCorrectAnswers: function () {
      return c.showCorrectAnswers.call(this);
    },
  });
  return d;
})();
DKI.TestQuestion.TrueFalseQuestion = {
  calculate: function (a, c, d) {
    return 1 > c ? 0 : 100;
  },
  getCorrectCount: function () {
    return 1;
  },
  getOptions: function () {
    for (
      var a = $(".dki-trueFalseOption-element", this.pageContainer),
        c = [],
        d,
        b = 0;
      b < a.length;
      b++
    ) {
      var f = $("input", a[b])[0];
      d = parseInt(f.getAttribute("data-order"), "10") - 1;
      for (var k = null, e = 0; e < this.question.options.length; e++)
        if (this.question.options[e].element_id == $(a[b]).data("id")) {
          k = this.question.options[e];
          break;
        }
      c[d] = new DKI.TestQuestion.TrueFalseOption(f, a[b], k);
    }
    return c;
  },
  getOptionFeedback: function () {
    return "";
  },
  hasSelection: function () {
    for (var a = this.getOptions(), c = 0; c < a.length; c++)
      if (1 == a[c].value()) return !0;
    return !1;
  },
};
DKI.TestQuestion.TrueFalseOption = function (a, c, d) {
  this.optionElement = a;
  this.optionValue = $(a).next();
  this.wrapper = c;
  this.choice = d;
  this.getFeedback = function () {
    return "";
  };
  this.correctResponse = function (b) {
    if (null != b && void 0 != b)
      $(this.optionElement).data("correctresponse", b.correct);
    else return $(this.optionElement).data("correctresponse");
  };
  this.isCorrect = function () {
    return this.choice.parameters.correct;
  };
  this.enabled = function (b) {
    if (void 0 !== b && null !== b) this.optionElement.disabled = !b;
    else return !this.optionElement.disabled;
  };
  this.value = function (b) {
    if (void 0 !== b && null !== b)
      1 == b || 1 == b
        ? ((this.optionElement.checked = !0),
          $("label", this.wrapper).addClass("checked"))
        : ((this.optionElement.checked = !1),
          $("label", this.wrapper).removeClass("checked"));
    else return this.optionElement.checked ? 1 : 0;
  };
  this.score = function () {
    return 1 == this.value() && this.isCorrect() ? this.value() : 0;
  };
  this.showCorrect = function (b) {
    1 == this.value() && this.isCorrect()
      ? ($(".dki-authoring-content-wrapper", this.wrapper).addClass("correct"),
        "" != settings.correctChoiceText &&
          ($(".dki-authoring-content-wrapper", this.wrapper).attr(
            "title",
            settings.correctChoiceText,
          ),
          $("label", this.wrapper).prepend(
            $(
              "\x3cdiv class\x3d'sr-only sr-feedback' tabIndex\x3d'1'\x3e" +
                $("label", this.wrapper).text() +
                ". " +
                settings.correctChoiceText +
                "\x3c/div\x3e",
            ),
          )))
      : 1 == this.value() &&
        ($(".dki-authoring-content-wrapper", this.wrapper).addClass(
          "incorrect",
        ),
        "" != settings.incorrectChoiceText &&
          ($(".dki-authoring-content-wrapper", this.wrapper).attr(
            "title",
            settings.incorrectChoiceText,
          ),
          $("label", this.wrapper).prepend(
            $(
              "\x3cdiv class\x3d'sr-only sr-feedback' tabIndex\x3d'1'\x3e" +
                $("label", this.wrapper).text() +
                ". " +
                settings.incorrectChoiceText +
                "\x3c/div\x3e",
            ),
          )));
    b &&
      this.isCorrect() &&
      $(".dki-authoring-content-wrapper", this.wrapper).addClass(
        "multiChoiceCorrectResponse",
      );
  };
  this.reset = function () {
    $(".dki-authoring-content-wrapper", this.wrapper)
      .removeClass("correct")
      .removeClass("incorrect")
      .removeClass("multiChoiceCorrectResponse")
      .removeAttr("tabIndex")
      .removeAttr("title")
      .find(".sr-only.sr-feedback")
      .remove();
    $(this.optionElement).prop("checked", !1);
    $(this.optionElement).attr("attr-checked", !1);
    "none" != $(this.optionElement).css("display") &&
      ($(".dki-element-anchor", this.wrapper).attr(
        "tabIndex",
        this.optionElement.tabIndex,
      ),
      (this.optionElement.tabIndex = -1));
    this.optionValue.removeClass("checked");
    var b = $(this.optionElement).closest(".input-group");
    b[0] && b.removeClass("checked").find(".checked").removeClass("checked");
    this.enabled(!0);
  };
  this.start = function () {
    "none" != $(this.optionElement).css("display") &&
      ((this.optionElement.tabIndex = $(
        ".dki-element-anchor",
        this.wrapper,
      ).data("tabIndex")),
      $(".dki-element-anchor", this.wrapper).attr("tabIndex", -1));
  };
};
DKI.TestQuestion.MultipleChoiceQuestion = {
  calculate: function (a, c, d) {
    return d > c ? 0 : ((c - d) / a) * 100;
  },
  getCorrectCount: function () {
    for (var a = 0, c = this.getOptions(), d = 0; d < c.length; d++)
      c[d].choice.parameters.correct && a++;
    return a;
  },
  getOptions: function () {
    for (
      var a = $(".dki-multiChoiceOption-element", this.pageContainer),
        c = [],
        d,
        b = 0;
      b < a.length;
      b++
    ) {
      var f = $("input", a[b])[0];
      d = parseInt(f.getAttribute("data-order"), "10") - 1;
      for (var k = null, e = 0; e < this.question.options.length; e++)
        if (this.question.options[e].element_id == $(a[b]).data("id")) {
          k = this.question.options[e];
          break;
        }
      c[d] = new DKI.TestQuestion.MultipleChoiceOption(f, a[b], k);
    }
    return c;
  },
  randomizeOptions: function () {
    for (
      var a = $(
          ".dki-multiChoiceOption-element[data-randomized\x3d'true']",
          this.pageContainer,
        ),
        c = [],
        d = [],
        b = [],
        f = [],
        k = this.getOptions(),
        e = 0;
      e < k.length;
      e++
    )
      k[e].wrapper.data("randomized") && f.push(e);
    $.each(a, function (b, a) {
      var e = settings.responsive ? 0 : $(a).data("y"),
        f = settings.responsive ? 0 : $(a).data("x");
      c[b] = {
        top: e,
        left: f,
        numbering: $(a).find(".optionNumber").text(),
        key: b,
      };
      $(a).before(
        "\x3cdiv class\x3d'RandomPlaceHolder' id\x3d'RandomPlaceHolder" +
          b +
          "'\x3e\x3c/div\x3e",
      );
      d[b] = $(a).detach();
    });
    a = d.length;
    for (e = 0; e < a; e++)
      b.push(d.splice(Math.floor(Math.random() * d.length), 1)[0]);
    for (e = 0; e < a; e++)
      $(b[e])
        .data("y", c[e].top)
        .data("x", c[e].left)
        .data("numbering", c[e].numbering)
        .data("feedbackOrder", f[e] + 1)
        .css({
          left: c[e].left,
          top: c[e].top,
        }),
        $(".optionNumber", b[e]).text(c[e].numbering),
        $("#RandomPlaceHolder" + c[e].key, this.pageContainer).before(b[e]);
    $(".RandomPlaceHolder", this.pageContainer).remove();
    $(".dki-multiChoiceOption-element .multiChoiceContentWrapper").css(
      "visibility",
      "",
    );
  },
  getOptionFeedback: function () {
    for (var a = "", c = this.getOptions(), d = [], b = 0; b < c.length; b++) {
      var f;
      f = c[b].wrapper.data("randomized")
        ? parseInt(c[b].wrapper.data("feedbackOrder"), "10")
        : parseInt(c[b].optionElement.getAttribute("data-order"), "10");
      d[f - 1] = c[b];
    }
    for (b = 0; b < d.length; b++)
      this.question.include_selection_feedback && 1 == d[b].value().checked
        ? (a += d[b].getFeedback())
        : this.question.include_correct_feedback && d[b].isCorrect()
          ? (a += d[b].getFeedback())
          : this.question.include_incorrect_feedback &&
            !d[b].isCorrect() &&
            (a += d[b].getFeedback());
    return a;
  },
  hasSelection: function () {
    for (var a = this.getOptions(), c = 0; c < a.length; c++)
      if (1 == a[c].value().checked) return !0;
    return !1;
  },
};
DKI.TestQuestion.MultipleChoiceOption = function (a, c, d) {
  this.optionElement = a;
  this.optionValue = $(a).next();
  this.wrapper = $(c);
  this.choice = d;
  this.getFeedback = function () {
    var b = "",
      a = this.wrapper.data("feedback");
    a &&
      ((a = a
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, "\x3e")
        .replace(/&lt;/g, "\x3c")
        .replace(/&amp;/g, "\x26")),
      (b =
        b +
        "\x3cdiv class\x3d'optionFeedbackWrapper'\x3e\x3cspan class\x3d'optionFeedbackNumbering'\x3e" +
        $(".optionNumber", this.wrapper).text()),
      (b =
        b +
        "\x3c/span\x3e\x3cspan class\x3d'optionFeedbackContent'\x3e" +
        a +
        "\x3c/span\x3e\x3c/div\x3e"));
    return b;
  };
  this.correctResponse = function (b) {
    if (null != b && void 0 != b)
      this.optionElement.setAttribute("data-correctresponse", b.correct);
    else return this.optionElement.getAttribute("data-correctresponse");
  };
  this.isCorrect = function () {
    return this.choice.parameters.correct;
  };
  this.enabled = function (b) {
    if (null !== b && void 0 !== b) this.optionElement.disabled = !b;
    else return !this.optionElement.disabled;
  };
  this.value = function (b) {
    if (null !== b && void 0 !== b) {
      if (
        (1 == b.checked
          ? ((this.optionElement.checked = !0),
            $(".input-group, label", this.wrapper).addClass("checked"))
          : ((this.optionElement.checked = !1),
            $(".input-group, label", this.wrapper).removeClass("checked")),
        this.wrapper.data("randomized"))
      ) {
        var a = $("#" + b.elementIdReplaced + "_wrapper");
        this.wrapper.css({
          left: a.data("x"),
          top: a.data("y"),
        });
        $(".optionNumber", this.wrapper).text(a.data("numbering"));
        this.wrapper.data("feedbackOrder", b.feedbackOrder);
      }
    } else
      return (
        (b = {
          text: this.choice.content,
          elementIdReplaced: null,
          feedbackOrder: null,
        }),
        this.wrapper.data("randomized") &&
          ((b.elementIdReplaced = this.wrapper.data("elementIdReplaced")),
          (b.feedbackOrder = this.wrapper.data("feedbackOrder"))),
        (b.checked = this.optionElement.checked ? 1 : 0),
        b
      );
  };
  this.score = function () {
    return 1 == this.value().checked && this.isCorrect()
      ? 1
      : 1 != this.value().checked || this.isCorrect()
        ? 0
        : -1;
  };
  this.showCorrect = function (b) {
    1 == this.value().checked &&
      (this.isCorrect()
        ? ($(".dki-authoring-content-wrapper", this.wrapper).addClass(
            "correct",
          ),
          "" != settings.correctChoiceText &&
            ($(".dki-authoring-content-wrapper", this.wrapper).attr(
              "title",
              settings.correctChoiceText,
            ),
            $("label", this.wrapper).prepend(
              $(
                "\x3cdiv class\x3d'sr-only sr-feedback' tabIndex\x3d'1'\x3e" +
                  $("label", this.wrapper).text() +
                  ". " +
                  settings.correctChoiceText +
                  "\x3c/div\x3e",
              ),
            )))
        : ($(".dki-authoring-content-wrapper", this.wrapper).addClass(
            "incorrect",
          ),
          "" != settings.incorrectChoiceText &&
            ($(".dki-authoring-content-wrapper", this.wrapper).attr(
              "title",
              settings.incorrectChoiceText,
            ),
            $("label", this.wrapper).prepend(
              $(
                "\x3cdiv class\x3d'sr-only sr-feedback' tabIndex\x3d'1'\x3e" +
                  $("label", this.wrapper).text() +
                  ". " +
                  settings.inorrectChoiceText +
                  "\x3c/div\x3e",
              ),
            ))));
    b &&
      this.isCorrect() &&
      $(".dki-authoring-content-wrapper", this.wrapper).addClass(
        "multiChoiceCorrectResponse",
      );
  };
  this.reset = function () {
    $(".dki-authoring-content-wrapper", this.wrapper)
      .removeClass("correct")
      .removeClass("incorrect")
      .removeClass("multiChoiceCorrectResponse")
      .removeAttr("tabIndex")
      .removeAttr("title")
      .find(".sr-only.sr-feedback")
      .remove();
    $(this.optionElement).prop("checked", !1);
    "none" != $(this.optionElement).css("display") &&
      ($(".dki-element-anchor", this.wrapper).attr(
        "tabIndex",
        this.optionElement.tabIndex,
      ),
      (this.optionElement.tabIndex = -1));
    this.optionValue.removeClass("checked");
    $(this.optionElement).attr("attr-checked", !1);
    $(".optionNumber", this.wrapper).text(this.wrapper.data("numbering"));
    this.wrapper.data("feedbackOrder", null);
    this.wrapper.data("elementIdReplaced", null);
    var b = $(this.optionElement).closest(".input-group");
    b[0] && b.removeClass("checked").find(".checked").removeClass("checked");
    this.enabled(!0);
  };
  this.start = function () {
    "none" != $(this.optionElement).css("display") &&
      ((this.optionElement.tabIndex = $(
        ".dki-element-anchor",
        this.wrapper,
      ).data("tabIndex")),
      $(".dki-element-anchor", this.wrapper).attr("tabIndex", -1));
  };
};
DKI.TestQuestion.FillBlanksQuestion = {
  calculate: function (a, c, d) {
    return (c / a) * 100;
  },
  getCorrectCount: function () {
    return this.getOptions().length;
  },
  getOptions: function () {
    for (
      var a = $(".dki-fillBlanksOption-element", this.pageContainer),
        c = [],
        d,
        b = 0;
      b < a.length;
      b++
    ) {
      var f = $("input", a[b])[0];
      d = parseInt(f.getAttribute("data-order"), "10") - 1;
      for (var k = null, e = 0; e < this.question.options.length; e++)
        if (this.question.options[e].element_id == $(a[b]).data("id")) {
          k = this.question.options[e];
          break;
        }
      c[d] = new DKI.TestQuestion.FillBlanksOption(f, $(a[b]), k);
    }
    return c;
  },
  getOptionFeedback: function () {
    for (var a = "", c = this.getOptions(), d = 0; d < c.length; d++)
      this.question.include_correct_feedback && 1 == c[d].score()
        ? (a += c[d].getFeedback())
        : this.question.include_incorrect_feedback &&
          0 == c[d].score() &&
          (a += c[d].getFeedback());
    return a;
  },
  hasSelection: function () {
    for (var a = this.getOptions(), c = 0; c < a.length; c++)
      if ("" == a[c].value()) return !1;
    return !0;
  },
};
DKI.TestQuestion.FillBlanksOption = function (a, c, d) {
  this.optionElement = a;
  this.wrapper = c;
  this.choice = d;
  this.getFeedback = function () {
    var b = "",
      a = this.wrapper.data("feedback");
    a &&
      ((a = a
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, "\x3e")
        .replace(/&lt;/g, "\x3c")
        .replace(/&amp;/g, "\x26")),
      (b =
        b +
        "\x3cdiv class\x3d'optionFeedbackWrapper'\x3e\x3cspan class\x3d'optionFeedbackNumbering'\x3e" +
        $(".optionNumber", this.wrapper).text()),
      (b =
        b +
        "\x3c/span\x3e\x3cspan class\x3d'optionFeedbackContent'\x3e" +
        a +
        "\x3c/span\x3e\x3c/div\x3e"));
    return b;
  };
  this.correctResponse = function (b) {
    if (null != b && void 0 != b)
      this.optionElement.setAttribute("data-correctresponse", b.correctValues);
    else return this.optionElement.getAttribute("data-correctresponse");
  };
  this.enabled = function (b) {
    if (null !== b && void 0 !== b) this.optionElement.disabled = !b;
    else return !this.optionElement.disabled;
  };
  this.value = function (b) {
    if (null !== b && void 0 !== b) $(this.optionElement).val(b);
    else return $.trim($(this.optionElement).val()).toLowerCase();
  };
  this.isCorrect = function () {
    return 1 == this.score() ? !0 : !1;
  };
  this.score = function () {
    for (
      var b = this.choice.parameters.correctValues, a = 0;
      a < b.length;
      a++
    ) {
      var d = $.trim(b[a]).toLowerCase(),
        c = this.value();
      $.isNumeric(d) &&
        ((d = parseFloat(d)), (c = parseFloat(c.replace(/\,|\s/g, ""))));
      d = $("\x3cspan\x3e" + d + "\x3c/span\x3e")
        .text()
        .trim();
      if (c == d) return 1;
    }
    return 0;
  };
  this.showCorrect = function (b) {
    1 == this.score()
      ? ($(".dki-question-option", this.wrapper).addClass("correct"),
        "" != settings.correctChoiceText &&
          $(".dki-question-option", this.wrapper)
            .attr("title", settings.correctChoiceText)
            .append(
              $(
                "\x3cdiv class\x3d'sr-only sr-feedback' tabIndex\x3d'1'\x3e" +
                  $(this.optionElement).val() +
                  ". " +
                  settings.correctChoiceText +
                  "\x3c/div\x3e",
              ),
            ))
      : ($(".dki-question-option", this.wrapper).addClass("incorrect"),
        "" != settings.incorrectChoiceText &&
          $(".dki-question-option", this.wrapper)
            .attr("title", settings.incorrectChoiceText)
            .append(
              $(
                "\x3cdiv class\x3d'sr-only sr-feedback' tabIndex\x3d'1'\x3e" +
                  $(this.optionElement).val() +
                  ". " +
                  settings.incorrectChoiceText +
                  "\x3c/div\x3e",
              ),
            ));
  };
  this.reset = function () {
    $(this.optionElement).val("");
    $(".dki-element-anchor", this.wrapper).attr(
      "tabIndex",
      this.optionElement.tabIndex,
    );
    this.optionElement.tabIndex = -1;
    $(".dki-question-option", this.wrapper).removeClass("correct");
    $(".dki-question-option", this.wrapper).removeClass("incorrect");
    $(".dki-question-option", this.wrapper)
      .removeAttr("tabIndex")
      .removeAttr("title")
      .find(".sr-only.sr-feedback")
      .remove();
    this.enabled(!0);
  };
  this.start = function () {
    this.optionElement.tabIndex = $(".dki-element-anchor", this.wrapper).data(
      "tabIndex",
    );
    $(".dki-element-anchor", this.wrapper).attr("tabIndex", -1);
  };
};
DKI.TestQuestion.MultiplePulldownQuestion = {
  calculate: function (a, c, d) {
    return (c / a) * 100;
  },
  getCorrectCount: function () {
    return this.getOptions().length;
  },
  getOptions: function () {
    for (
      var a = $(".dki-multiPulldownOption-element", this.pageContainer),
        c = [],
        d,
        b = 0;
      b < a.length;
      b++
    ) {
      var f = $("select", a[b])[0];
      d = parseInt(f.getAttribute("data-order"), "10") - 1;
      for (var k = null, e = 0; e < this.question.options.length; e++)
        if (this.question.options[e].element_id == $(a[b]).data("id")) {
          k = this.question.options[e];
          break;
        }
      c[d] = new DKI.TestQuestion.MultiplePulldownOption(f, $(a[b]), k);
    }
    return c;
  },
  getOptionFeedback: function () {
    for (var a = "", c = this.getOptions(), d = 0; d < c.length; d++)
      this.question.include_correct_feedback && 1 == c[d].score()
        ? (a += c[d].getFeedback())
        : this.question.include_incorrect_feedback &&
          0 == c[d].score() &&
          (a += c[d].getFeedback());
    return a;
  },
  hasSelection: function () {
    for (var a = this.getOptions(), c = 0; c < a.length; c++)
      if ("" == a[c].value()) return !1;
    return !0;
  },
};
DKI.TestQuestion.MultiplePulldownOption = function (a, c, d) {
  this.optionElement = a;
  this.wrapper = c;
  this.choice = d;
  this.getFeedback = function () {
    var b = "",
      a = this.wrapper.data("feedback");
    a &&
      ((a = a
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, "\x3e")
        .replace(/&lt;/g, "\x3c")
        .replace(/&amp;/g, "\x26")),
      (b =
        b +
        "\x3cdiv class\x3d'optionFeedbackWrapper'\x3e\x3cspan class\x3d'optionFeedbackNumbering'\x3e" +
        $(".optionNumber", this.wrapper).text()),
      (b =
        b +
        "\x3c/span\x3e\x3cspan class\x3d'optionFeedbackContent'\x3e" +
        a +
        "\x3c/span\x3e\x3c/div\x3e"));
    return b;
  };
  this.correctResponse = function (b) {
    if (null != b && void 0 != b)
      this.optionElement.setAttribute("data-correctresponse", b.correctValue);
    else return this.optionElement.getAttribute("data-correctresponse");
  };
  this.isCorrect = function () {
    var b = $(
      '\x3cselect\x3e\x3coption value\x3d"' +
        escape(this.choice.parameters.correctValue.trim()) +
        '"\x3e' +
        this.choice.parameters.correctValue +
        "\x3c/option\x3e\x3c/select\x3e",
    );
    return escape(this.value().trim()) == b.value() ? !0 : !1;
  };
  this.enabled = function (b) {
    if (null !== b && void 0 !== b) this.optionElement.disabled = !b;
    else return !this.optionElement.disabled;
  };
  this.value = function (b) {
    if (null !== b && void 0 != b) $(this.optionElement).val(b);
    else return $(this.optionElement).val();
  };
  this.score = function () {
    return this.isCorrect() ? 1 : 0;
  };
  this.showCorrect = function (b) {
    1 == this.score()
      ? ($(".dki-question-option", this.wrapper).addClass("correct"),
        "" != settings.correctChoiceText &&
          $(".dki-question-option", this.wrapper)
            .attr("title", settings.correctChoiceText)
            .append(
              $(
                "\x3cdiv class\x3d'sr-only sr-feedback' tabIndex\x3d'1'\x3e" +
                  $(this.optionElement).val() +
                  ". " +
                  settings.correctChoiceText +
                  "\x3c/div\x3e",
              ),
            ))
      : ($(".dki-question-option", this.wrapper).addClass("incorrect"),
        "" != settings.incorrectChoiceText &&
          $(".dki-question-option", this.wrapper)
            .attr("title", settings.incorrectChoiceText)
            .append(
              $(
                "\x3cdiv class\x3d'sr-only sr-feedback' tabIndex\x3d'1'\x3e" +
                  $(this.optionElement).val() +
                  ". " +
                  settings.incorrectChoiceText +
                  "\x3c/div\x3e",
              ),
            ));
  };
  this.reset = function () {
    this.optionElement.selectedIndex = 0;
    $(".dki-element-anchor", this.wrapper).attr(
      "tabIndex",
      this.optionElement.tabIndex,
    );
    this.optionElement.tabIndex = -1;
    $(".dki-question-option", this.wrapper).removeClass("correct");
    $(".dki-question-option", this.wrapper).removeClass("incorrect");
    $(".dki-question-option", this.wrapper)
      .removeAttr("tabIndex")
      .removeAttr("title")
      .find(".sr-only.sr-feedback")
      .remove();
    this.enabled(!0);
  };
  this.start = function () {
    this.optionElement.tabIndex = $(".dki-element-anchor", this.wrapper).data(
      "tabIndex",
    );
    $(".dki-element-anchor", this.wrapper).attr("tabIndex", -1);
  };
};
DKI.TestQuestion.FreeFormQuestion = {
  calculate: function () {
    return "" !== this.getOptions()[0].value().trim() ? 100 : 0;
  },
  getCorrectCount: function () {
    return 0;
  },
  getOptions: function () {
    for (
      var a = $(".dki-freeFormOption-element textarea", this.pageContainer),
        c = [],
        d,
        b = 0;
      b < a.length;
      b++
    )
      (d = parseInt(a[b].getAttribute("data-order"), "10") - 1),
        (c[d] = new DKI.TestQuestion.FreeFormOption(
          a[b],
          $(a[b]).closest(".dki-authoring-element"),
        ));
    return c;
  },
  getOptionFeedback: function () {
    return "";
  },
  hasSelection: function () {
    for (var a = this.getOptions(), c = 0; c < a.length; c++)
      if ("" == a[c].value()) return !1;
    return !0;
  },
};
DKI.TestQuestion.FreeFormOption = function (a, c) {
  this.optionElement = a;
  this.wrapper = c;
  this.correctResponse = function () {
    return "";
  };
  this.getFeedback = function () {
    return "";
  };
  this.isCorrect = function () {
    return "" != this.value() ? !0 : !1;
  };
  this.enabled = function (a) {
    if (null !== a && void 0 !== a) this.optionElement.disabled = !a;
    else return !this.optionElement.disabled;
  };
  this.value = function (a) {
    if (null !== a && void 0 !== a) $(this.optionElement).val(a);
    else return $(this.optionElement).val();
  };
  this.score = function () {
    return 0;
  };
  this.showCorrect = function (a) {
    this.isCorrect()
      ? ($(".dki-question-option", this.wrapper).addClass("correct"),
        "" != settings.correctChoiceText &&
          $(".dki-question-option", this.wrapper)
            .attr("title", settings.correctChoiceText)
            .append(
              $(
                "\x3cdiv class\x3d'sr-only sr-feedback' tabIndex\x3d'1'\x3e" +
                  $(this.optionElement).val() +
                  ". " +
                  settings.correctChoiceText +
                  "\x3c/div\x3e",
              ),
            ))
      : ($(".dki-question-option", this.wrapper).addClass("incorrect"),
        "" != settings.incorrectChoiceText &&
          $(".dki-question-option", this.wrapper)
            .attr("title", settings.incorrectChoiceText)
            .append(
              $(
                "\x3cdiv class\x3d'sr-only sr-feedback' tabIndex\x3d'1'\x3e" +
                  $(this.optionElement).val() +
                  ". " +
                  settings.incorrectChoiceText +
                  "\x3c/div\x3e",
              ),
            ));
  };
  this.reset = function () {
    $(this.optionElement).val("");
    $(".dki-element-anchor", this.wrapper).attr(
      "tabIndex",
      this.optionElement.tabIndex,
    );
    this.optionElement.tabIndex = -1;
    $(".dki-question-option", this.wrapper).removeClass("correct");
    $(".dki-question-option", this.wrapper).removeClass("incorrect");
    $(".dki-question-option", this.wrapper)
      .removeAttr("tabIndex")
      .removeAttr("title")
      .find(".sr-only.sr-feedback")
      .remove();
    this.enabled(!0);
  };
  this.start = function () {
    this.optionElement.tabIndex = $(".dki-element-anchor", this.wrapper).data(
      "tabIndex",
    );
    $(".dki-element-anchor", this.wrapper).attr("tabIndex", -1);
  };
};
DKI.TestQuestion.DragDropQuestion = {
  calculate: function (a, c, d) {
    return 0 == a && 0 == c && 0 == d ? 0 : (c / a) * 100;
  },
  getCorrectCount: function () {
    return $(
      ".dki-authoring-element[data-is-draggable\x3dtrue][data-isquestionelement\x3dtrue]",
      this.pageContainer,
    ).length;
  },
  getOptions: function () {
    for (
      var a = $(
          ".dki-authoring-element[data-is-draggable\x3dtrue][data-isquestionelement\x3dtrue]",
          this.pageContainer,
        ),
        c = [],
        d = 0;
      d < a.length;
      d++
    ) {
      for (
        var b = null, f = $(a[d]).data("id"), k = 0;
        k < this.question.options.length;
        k++
      )
        this.question.options[k].element_id == f &&
          (b = this.question.options[k]);
      c[d] = new DKI.TestQuestion.DragDropOption(a[d], b);
    }
    return c;
  },
  getOptionFeedback: function () {
    return "";
  },
  hasSelection: function () {
    for (var a = this.getOptions(), c = 0; c < a.length; c++)
      if (null != a[c].value().target.id) return !0;
    return !1;
  },
};
DKI.TestQuestion.customQuestion = {
  calculate: function (a, c, d, b) {
    try {
      if (isNaN(b)) throw "Invalid data. Please provide a numeric score.";
      b = parseInt(b, 10);
      b = 0 > b ? 0 : b;
      return 100 < b ? 100 : b;
    } catch (f) {
      return 0;
    }
  },
  getOptions: function () {
    return [];
  },
  getOptionFeedback: function () {
    return "";
  },
  getCorrectCount: function () {
    return 0;
  },
  hasSelection: function () {
    return !0;
  },
};
DKI.TestQuestion.DragDropOption = function (a, c) {
  this.optionElement = a;
  this.questionOption = c;
  this.correctResponse = function (a) {
    a = this.value();
    $(this.optionElement).css({
      top: a.y + "px",
      left: a.x + "px",
    });
    return null;
  };
  this.getFeedback = function () {
    return "";
  };
  this.enabled = function (a) {
    if (null !== a && void 0 !== a) {
      $(this.optionElement).draggable({
        disabled: !a,
      });
      var b = 0;
      $(
        ".dki-authoring-element[data-is-droppable\x3dtrue][data-isquestionelement\x3dtrue]",
        this.pageContainer,
      ).each(function () {
        var a = parseInt($(this).css("z-index"), 10);
        a > b && (b = a);
      });
      a = $(this.optionElement).data("elementno");
      $(this.optionElement).css("z-index", Math.max(b + 1, a));
      $(this.optionElement)
        .parent(".dki-authoring-group")
        .css("position", "static");
    } else return !1;
  };
  this.value = function (a) {
    if (null !== a && void 0 !== a) $(this.optionElement).data("dropData", a);
    else {
      a = $(this.optionElement).data("dropData");
      if (!a) {
        a = $(this.optionElement).position();
        var b = $(this.optionElement).data("title");
        "" == b && (b = $(this.optionElement).text());
        a = {
          id: $(this.optionElement).data("dragdropid"),
          elementId: $(this.optionElement).data("id"),
          title: b,
          target: {
            id: null,
            title: "No Target",
          },
          x: a.left,
          y: a.top,
        };
      }
      return a;
    }
  };
  this.isCorrect = function () {
    return 1 == this.score() ? !0 : !1;
  };
  this.score = function () {
    var a = this.value().target.id;
    if (a) {
      for (
        var b = 0;
        b < this.questionOption.parameters.correctTargets.length;
        b++
      )
        if (
          a.toString().toLowerCase() ==
          this.questionOption.parameters.correctTargets[b]
            .toString()
            .toLowerCase()
        )
          return 1;
      return -1;
    }
    return 0 < this.questionOption.parameters.correctTargets.length ? -1 : 1;
  };
  this.showCorrect = function (a) {
    1 == this.score()
      ? ($(this.optionElement).addClass("correct"),
        "" != settings.correctChoiceText &&
          $(this.optionElement)
            .find(".dki-element-content")
            .attr("title", settings.correctChoiceText)
            .append(
              $(
                "\x3cdiv class\x3d'sr-only sr-feedback'\x3e" +
                  settings.correctChoiceText +
                  "\x3c/div\x3e",
              ),
            ))
      : ($(this.optionElement).addClass("incorrect"),
        "" != settings.incorrectChoiceText &&
          $(this.optionElement)
            .find(".dki-element-content")
            .attr("title", settings.incorrectChoiceText)
            .append(
              $(
                "\x3cdiv class\x3d'sr-only sr-feedback'\x3e" +
                  settings.incorrectChoiceText +
                  "\x3c/div\x3e",
              ),
            ));
  };
  this.reset = function () {
    $(this.optionElement).data("dropData", null);
    $(this.optionElement).removeClass("correct");
    $(this.optionElement).removeClass("incorrect");
    $(this.optionElement)
      .removeAttr("tabIndex")
      .removeAttr("title")
      .find(".sr-only.sr-feedback")
      .remove();
    this.enabled(!0);
  };
  this.start = function () {};
};
DKI.TestQuestion.ImageMapOption = function (a) {
  this.mapEl = $(a.pageContainer).find(
    "#" + a.question.options[0].elementId + "_wrapper img",
  );
  this.test = a;
  return this;
};
DKI.TestQuestion.ImageMapOption.prototype = {
  showCorrect: function (a) {
    (this.test.isSinglePage || this.test.isPracticeQuestion) &&
      this.mapEl.ImageMap("enterReview", !0, !a);
  },
  start: function () {},
  score: function () {
    return this.mapEl.data("dki.ImageMap").score();
  },
  value: function () {
    return "";
  },
  correctResponse: function () {},
  enabled: function (a) {
    this.mapEl.ImageMap(a ? "enable" : "disable");
  },
  reset: function () {
    this.mapEl.ImageMap("reset");
    this.enabled(!0);
  },
};
DKI.TestQuestion.ScenarioOption = function (a) {
  this.scenarioEl = $(a.pageContainer).find(
    "#content_" + a.question.options[0].elementId,
  );
  this.test = a;
  return this;
};
DKI.TestQuestion.ScenarioOption.prototype = {
  showCorrect: function (a) {
    (this.test.isSinglePage || this.test.isPracticeQuestion) &&
      this.scenarioEl.Scenario("enterReview", !0, !a);
  },
  start: function () {},
  score: function () {
    return this.scenarioEl.data("dki.Scenario").getScore();
  },
  value: function () {
    return "";
  },
  correctResponse: function () {},
  enabled: function (a) {
    this.scenarioEl.Scenario(a ? "enable" : "disable");
  },
  reset: function () {
    this.scenarioEl.Scenario("reset");
  },
};
DKI.TestQuestion.captureQuestion = {
  init: function (a) {
    a.captureEl = $(a.pageContainer).find(
      "#" + a.question.options[0].elementId + "_wrapper",
    );
    var c = function () {
      return {
        review: a.isPracticeQuestion,
        retake:
          !a.inReview &&
          a.isPracticeQuestion &&
          a.question.show_try_again &&
          a.numAttempts < a.question.attempts,
        next: function () {
          $(document).trigger(DKI.Events.TestQuestion.nextClicked);
        },
      };
    };
    $(document).one(DKI.ContentPage.events.loadFinished, function () {
      a.captureEl
        .off(tryMe.EVENT.RESTART_BUTTON + ".dkiTest")
        .on(tryMe.EVENT.RESTART_BUTTON + ".dkiTest", function () {
          a.numAttempts += 1;
          a.captureEl.capture("setOption", ["buttons", c()]);
        });
      a.captureEl.capture("setOption", ["buttons", c()]);
      $(document).one(
        DKI.Events.TestQuestion.nextClicked +
          " " +
          DKI.Events.TestQuestion.forceEnd,
        function () {
          a.captureEl.capture("cleanup");
        },
      );
      a.captureEl.capture("setOption", [
        "showCorrectAnswers",
        a.canShowCorrectAnswers() &&
          (("pre" == a.prePost && a.behaviour.reviewPreAnswers) ||
            ("post" == a.prePost && a.behaviour.reviewPostAnswers)),
      ]);
      var d = a.canShowFeedback();
      a.captureEl.capture("setOption", ["showFeedback", d]);
      a.captureEl
        .off(testMe.EVENT.COMPLETE + ".dkiTest")
        .on(testMe.EVENT.COMPLETE + ".dkiTest", function (b, c) {
          a.inReview || a.submitted || a.submitQuestion(c.testMe.getScore());
        });
      d &&
        ((d = a.question.parameters.feedback),
        a.captureEl.capture("setOption", [
          "feedback",
          {
            correct: d.correct.useDefault
              ? contentApi.getDefaultFeedbackText("correct")
              : d.correct.text,
            incorrect: d.incorrect.useDefault
              ? contentApi.getDefaultFeedbackText("incorrect")
              : d.incorrect.text,
          },
        ]));
    });
  },
  onShowReview: function (a) {
    var c = this;
    this.captureEl.css({
      opacity: 0,
      transition: "",
    });
    $(document).one(DKI.ContentPage.events.loadFinished, function () {
      c.question.timedOut &&
        c.captureEl.capture("setOption", ["overrideScore", 0]);
      c.captureEl.capture("import", [c.question.data]);
      c.captureEl.capture("enterReview");
      c.captureEl.css({
        opacity: 1,
        transition: "opacity 150ms linear",
      });
      a();
    });
  },
  calculate: function () {
    return this.captureEl.capture("getScore");
  },
  getData: function () {
    return this.captureEl.capture("export");
  },
  getOptions: function () {
    return [];
  },
  getOptionFeedback: function () {
    return "";
  },
  getCorrectCount: function () {
    return 0;
  },
  hasSelection: function () {
    return !0;
  },
};
DKI.TestQuestion.imageMapQuestion = {
  init: function (a) {
    a.mapEl = $(a.pageContainer).find(
      "#" + a.question.options[0].elementId + "_wrapper img",
    );
  },
  onShowReview: function (a) {
    var c = this;
    this.mapEl.css({
      opacity: 0,
      transition: "",
    });
    $(document).one(DKI.ContentPage.events.loadFinished, function () {
      c.mapEl.ImageMap("import", c.question.data);
      a();
      c.mapEl.ImageMap("enterReview", [
        c.canShowCorrectAnswers() &&
          (("pre" == c.prePost && c.behaviour.reviewPreAnswers) ||
            ("post" == c.prePost && c.behaviour.reviewPostAnswers)),
        !0,
      ]);
      c.mapEl.css({
        opacity: 1,
        transition: "opacity 150ms linear",
      });
    });
  },
  calculate: function () {
    return this.mapEl.data("dki.ImageMap").score();
  },
  getData: function () {
    return this.mapEl.data("dki.ImageMap").export();
  },
  getOptions: function () {
    return [new DKI.TestQuestion.ImageMapOption(this)];
  },
  showInlineFeedback: function () {
    this.mapEl.ImageMap(
      "showInlineFeedback",
      function () {
        $(document).trigger(DKI.Events.TestQuestion.nextClicked);
      },
      !this.inReview,
    );
  },
  hasInlineFeedback: function () {
    return this.mapEl.data("dki.ImageMap").hasInlineFeedback();
  },
  getOptionFeedback: function () {
    return "";
  },
  getCorrectCount: function () {
    return 0;
  },
  hasSelection: function () {
    return this.mapEl.data("dki.ImageMap").hasSelection();
  },
};
DKI.TestQuestion.scenarioQuestion = {
  init: function (a) {
    a.scenarioEl = $(a.pageContainer).find(
      "#content_" + a.question.options[0].elementId,
    );
    $(document).one(DKI.ContentPage.events.loadFinished, function () {
      a.scenarioEl.on("scenario.end", function () {
        a.inReview || a.showDefaultSubmit();
      });
    });
  },
  onShowReview: function (a) {
    var c = this;
    this.scenarioEl.css({
      opacity: 0,
      transition: "",
    });
    $(document).one(DKI.ContentPage.events.loadFinished, function () {
      c.scenarioEl.Scenario("import", c.question.data);
      a();
      c.scenarioEl.Scenario("enterReview", [
        c.canShowCorrectAnswers() &&
          (("pre" == c.prePost && c.behaviour.reviewPreAnswers) ||
            ("post" == c.prePost && c.behaviour.reviewPostAnswers)),
        !0,
      ]);
      c.scenarioEl.css({
        opacity: 1,
        transition: "opacity 150ms linear",
      });
    });
  },
  calculate: function () {
    return this.scenarioEl.data("dki.Scenario").getScore();
  },
  getData: function () {
    return this.scenarioEl.data("dki.Scenario").export();
  },
  getOptions: function () {
    return [new DKI.TestQuestion.ScenarioOption(this)];
  },
  showInlineFeedback: function () {
    this.scenarioEl.Scenario("showInlineFeedback");
  },
  getOptionFeedback: function () {
    return "";
  },
  getCorrectCount: function () {
    return 0;
  },
  hasSelection: function () {
    return !0;
  },
};
