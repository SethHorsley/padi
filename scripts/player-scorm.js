if (!DKI) var DKI = {};
DKI.scormAPI = function (a) {
  this.scormAPI = a.launchInNewWindow ? window.opener.parent : window.parent;
  this.supportHighASCII = a.supportHighASCII ? !0 : !1;
  this.resizeEvent = a.resizeEvent ? a.resizeEvent : "resize";
};
DKI.scormAPI.prototype.onPlayerResize = function (a, b) {
  var c = this,
    d =
      !dkiUA.mobile && playerBehaviour.launchInNewWindow
        ? window
        : this.scormAPI,
    f = a.totalWidth - $(d).width(),
    e = a.totalHeight - $(d).height();
  d.top.resizeBy(f, e);
  800 >= screen.availHeight &&
    ((f = function () {
      if (a.totalHeight > $(d).height()) {
        var e = $(d).height() - a.barHeight;
        b.data.args = [e];
        b.callback(b.data);
        $(d).off(c.resizeEvent, this);
      }
    }),
    $(d).on(this.resizeEvent, $.proxy(f, f)));
};
DKI.scormAPI.prototype.onPlayerResize.async = !0;
DKI.scormAPI.prototype.getPageYOffset = function (a) {
  return this.scormAPI.pageYOffset;
};
DKI.scormAPI.prototype.getDataStorageInit = function () {
  var a = {
    GetBookmark: this.scormAPI.GetBookmark(),
    GetPassingScore: this.scormAPI.GetPassingScore(),
    GetDataChunk: this.scormAPI.GetDataChunk(),
    GetStatus: this.scormAPI.GetStatus(),
    LESSON_STATUS_PASSED: this.scormAPI.LESSON_STATUS_PASSED,
    LESSON_STATUS_FAILED: this.scormAPI.LESSON_STATUS_FAILED,
    LESSON_STATUS_COMPLETED: this.scormAPI.LESSON_STATUS_COMPLETED,
    GetStudentID: this.scormAPI.GetStudentID(),
    objLMS: this.scormAPI.objLMS,
  };
  this.scormAPI.tincan &&
    this.scormAPI.tincan.activity &&
    (a.rootXAPIActivity = this.scormAPI.tincan.activity);
  a.objLMS.Standard && (a.GetBookmark = a.GetBookmark.split("/").pop());
  return a;
};
DKI.scormAPI.prototype.saveCompletion = function (a, b, c) {
  "AICC" == this.scormAPI.objLMS.Standard.toUpperCase() && (b = encodeURI(b));
  c &&
    this.scormAPI.SetBookmark(
      "CMI5" === this.scormAPI.objLMS.Standard
        ? settings.activityRootURL + "page/" + c.id
        : c.id,
      c.title,
    );
  this.scormAPI.SetProgressMeasure(a);
  this.scormAPI.SetDataChunk(b);
  this.scormAPI.CommitData();
};
DKI.scormAPI.prototype.scoreTest = function (a, b) {
  "CMI5" === this.scormAPI.objLMS.Standard &&
    (Array.isArray(b)
      ? (b[0] = settings.activityRootURL + "question/" + b[0])
      : (b.id = settings.activityRootURL + "question/" + b.id));
  switch (a) {
    case 1:
      this.scormAPI.RecordTrueFalseInteraction.apply(this.scormAPI, b);
      break;
    case 2:
      for (a = 0; a < b.actualChoice.length; a++)
        b.actualChoice[a] = this.createResponseIdentifier(
          b.actualChoice[a].strShort,
          b.actualChoice[a].strLong,
        );
      for (a = 0; a < b.correctChoice.length; a++)
        b.correctChoice[a] = this.createResponseIdentifier(
          b.correctChoice[a].strShort,
          b.correctChoice[a].strLong,
        );
      this.scormAPI.RecordMultipleChoiceInteraction(
        b.id,
        b.actualChoice,
        b.isCorrect,
        b.correctChoice,
        b.questionBody,
        b.questionWeight,
        b.questionLatency,
      );
      break;
    case 3:
      this.scormAPI.RecordFillInInteraction.apply(this.scormAPI, b);
      break;
    case 4:
      this.scormAPI.RecordFillInInteraction.apply(this.scormAPI, b);
      break;
    case 5:
      for (a = 0; a < b.actualChoice.length; a++)
        b.actualChoice[a] = this.createResponseIdentifier(
          b.actualChoice[a].strShort,
          b.actualChoice[a].strLong,
        );
      for (a = 0; a < b.correctChoice.length; a++)
        b.correctChoice[a] = this.createResponseIdentifier(
          b.correctChoice[a].strShort,
          b.correctChoice[a].strLong,
        );
      this.scormAPI.RecordSequencingInteraction(
        b.id,
        b.actualChoice,
        b.isCorrect,
        b.correctChoice,
        b.questionBody,
        b.questionWeight,
        b.questionLatency,
      );
      break;
    case 6:
      for (a = 0; a < b.matchCall.length; a++) {
        var c = b.matchCall[a];
        c[1] = this.createResponseIdentifier(c[1].strShort, c[1].strLong);
        c[2] = this.createResponseIdentifier(c[2].strShort, c[2].strLong);
        this.scormAPI.MatchingResponse.call(c[0], c[1], c[2]);
      }
      this.scormAPI.RecordMatchingInteraction(
        b.id,
        b.actualChoice,
        b.isCorrect,
        b.correctChoice,
        b.questionBody,
        b.questionWeight,
        b.questionLatency,
      );
  }
};
DKI.scormAPI.prototype.process = function (a, b) {
  var c = this.getMember(a.action);
  if (c) {
    var d;
    d = c.member.async ? !0 : !1;
    a.args.push({
      callback: b,
      data: a,
    });
    a.args = c.member.apply(c.scp, a.args);
    d || b(a);
  }
};
DKI.scormAPI.prototype.getMember = function (a) {
  var b,
    c = function (a, b) {
      a = a.split(".");
      var e = a.shift();
      return "undefined" === typeof b[e]
        ? void 0
        : "object" !== typeof b[e] || 0 === a.length
          ? {
              scp: b,
              member: b[e],
            }
          : c(a.join("."), b[e]);
    };
  b = c(a, this);
  return "undefined" === typeof b ? c(a, this.scormAPI) : b;
};
DKI.scormAPI.prototype.doExit = function (a) {
  "SCORM2004" !== this.scormAPI.strLMSStandard ||
    ("passed" !== a && "failed" !== a && "complete" !== a) ||
    this.scormAPI.SCORM2004_SetNavigationRequest("exitAll");
  this.scormAPI.ConcedeControl();
};
DKI.scormAPI.prototype.getXAPIStatements = function (a, b) {
  var c = {
      callback: function (a, c) {
        b.callback({
          args: {
            err: a,
            result: c,
          },
        });
      },
      sendActor: a.sendActor ? !0 : !1,
      params: {},
    },
    d;
  for (d in a.params)
    if (!c.params[d]) {
      var f = d.charAt(0).toUpperCase() + d.slice(1);
      c.params[d] = this.scormAPI.TinCan[f]
        ? new this.scormAPI.TinCan[f](a.params[d])
        : a.params[d];
    }
  this.scormAPI.tincan.getStatements(c);
};
DKI.scormAPI.prototype.getXAPIStatements.async = !0;
DKI.scormAPI.prototype.createResponseIdentifier = function (a, b) {
  b = this.supportHighASCII ? encodeURIComponent(b) : b;
  return this.scormAPI.CreateResponseIdentifier(a, b);
};
DKI.SCORMAssessment = DKI.Assessment.extend({
  prototype: {
    init: function (a, b, c, d) {
      this._parent(a, b, c);
      this.scormAPI = d;
    },
    scoreQuestion: function (a, b, c, d, f) {
      this._parent(a, b, c, d, f);
      this.recordInteraction(a, b, c, f);
    },
    recordInteraction: function (a, b, c, d) {
      b.questionOptions = a.options;
      b.id = a.id;
      b.score = c;
      b.weight = a.weight;
      switch (b.type) {
        case 1:
          this.recordTrueFalse(b);
          break;
        case 2:
          this.recordMultipleChoice(b);
          break;
        case 3:
          this.recordFreeForm(b);
          break;
        case 4:
          this.recordFillBlanks(b);
          break;
        case 5:
          this.recordPulldown(b);
          break;
        case 6:
          this.recordDragDrop(b);
          break;
        case 9:
          this.recordImageMap(b, d);
      }
    },
    recordTrueFalse: function (a) {
      this.scormAPI.process("scoreTest", [
        1,
        [
          a.id,
          1 == a.options[0] ? !0 : !1,
          100 == a.score ? !0 : !1,
          a.questionOptions[0].parameters.correct,
          a.body,
          a.weight,
          a.latency,
        ],
      ]);
    },
    recordMultipleChoice: function (a) {
      for (
        var b = "abcdefgh".split(""),
          c = [],
          d = [],
          f = 100 == a.score ? !0 : !1,
          e = 0;
        e < a.options.length;
        e++
      )
        1 == a.options[e].checked &&
          (c[c.length] = {
            strShort: b[e],
            strLong: a.options[e].text,
          }),
          a.questionOptions[e].parameters.correct &&
            (d[d.length] = {
              strShort: b[e],
              strLong: a.options[e].text,
            });
      this.scormAPI.process("scoreTest", [
        2,
        {
          id: a.id,
          actualChoice: c,
          isCorrect: f,
          correctChoice: d,
          questionBody: a.body,
          questionWeight: a.weight,
          questionLatency: a.latency,
        },
      ]);
    },
    recordFillBlanks: function (a) {
      for (
        var b = "", c = "", d, f = 100 == a.score ? !0 : !1, e, h = 0;
        h < a.options.length;
        h++
      ) {
        b += a.options[h];
        d = a.questionOptions[h].parameters.correctValues;
        e = d[0];
        for (var g = 0; g < d.length; g++) {
          var k = $.trim(a.options[h].toString().toLowerCase()),
            l = $.trim(d[g].toString().toLowerCase());
          $.isNumeric(k) &&
            ((k = parseFloat(k)), (l = parseFloat(l.replace(/\,|\s/g, ""))));
          if (l === k) {
            e = d[g];
            break;
          }
        }
        c += e;
        h < a.options.length - 1 && ((b += ","), (c += ","));
      }
      this.scormAPI.process("scoreTest", [
        4,
        [a.id, b, f, c, a.body, a.weight, a.latency],
      ]);
    },
    recordPulldown: function (a) {
      for (var b, c, d, f = 0; f < a.options.length; f++) {
        var e = !1;
        d = [];
        d[0] = a.questionOptions[f].parameters.correctValue;
        d = d.concat(a.questionOptions[f].parameters.incorrectValues);
        c = [
          {
            strShort: "1",
            strLong: d[0].toString().trim(),
          },
        ];
        b = [];
        for (var h = 0; h < d.length; h++)
          a.options[f].toString().toLowerCase().trim() ==
            d[h].toString().toLowerCase().trim() &&
            ((b = [
              {
                strShort: (h + 1).toString(),
                strLong: a.options[f].toString().trim(),
              },
            ]),
            0 == h && (e = !0));
        this.scormAPI.process("scoreTest", [
          2,
          {
            id: a.id + "-" + a.questionOptions[f].elementId,
            actualChoice: b,
            isCorrect: e,
            correctChoice: c,
            questionBody: a.body,
            questionWeight:
              0 < a.weight
                ? Math.round((a.weight / a.options.length) * 100) / 100
                : 0,
            questionLatency: a.latency,
          },
        ]);
      }
    },
    recordFreeForm: function (a) {
      this.scormAPI.process("scoreTest", [
        3,
        [
          a.id,
          a.options[0],
          this.scormAPI.INTERACTION_RESULT_NEUTRAL,
          a.options[0],
          a.body,
          a.weight,
          a.latency,
        ],
      ]);
    },
    recordDragDrop: function (a) {
      for (
        var b = [],
          c = [],
          d,
          f,
          e,
          h = 100 == a.score ? !0 : !1,
          g = [],
          k = 0;
        k < a.options.length;
        k++
      ) {
        f = {
          strShort: (k + 1).toString(),
          strLong: a.options[k].title,
        };
        e = {
          strShort: (k + 1).toString(),
          strLong: a.options[k].target.title,
        };
        var l = b.length;
        b[l] = {};
        g.push([b[l], f, e]);
        for (var l = !1, n = null, m = 0; m < a.questionOptions.length; m++)
          a.questionOptions[m].element_id == a.options[k].elementId &&
            (n = a.questionOptions[m]);
        d = [];
        d = d.concat(n.parameters.correctTargets);
        if (0 < d.length) {
          for (m = 0; m < d.length; m++)
            a.options[k].target.id == d[m] &&
              ((l = c.length), (c[l] = {}), g.push([c[l], f, e]), (l = !0));
          l ||
            ((d = {
              strShort: (k + 1).toString(),
              strLong: d[0],
            }),
            (l = c.length),
            (c[l] = {}),
            g.push([c[l], f, d]));
        } else
          a.options[k].target.id
            ? ((d = {
                strShort: (k + 1).toString(),
                strLong: "No Target",
              }),
              (l = c.length),
              (c[l] = {}),
              g.push([c[l], f, d]))
            : ((l = c.length), (c[l] = {}), g.push([c[l], f, e]));
      }
      this.scormAPI.process("scoreTest", [
        6,
        {
          id: a.id,
          actualChoice: b,
          isCorrect: h,
          correctChoice: c,
          matchCall: g,
          questionBody: a.body,
          questionWeight: a.weight,
          questionLatency: a.latency,
        },
      ]);
    },
    recordImageMap: function (a, b) {
      var c = [],
        d = [],
        f = b.mapEl.data("dki.ImageMap");
      b = f.answers;
      var e = 100 == a.score ? !0 : !1,
        h = [];
      b = f.getAnswersByZone();
      var g = Object.keys(b).reduce(function (a, b) {
          "distractor" !== b && a.push(f.db.get(b).dragdrop_id);
          return a;
        }, []),
        k = 1;
      $.each(b, function (a, b) {
        if ("distractor" == a)
          $.each(this, function () {
            var a = {
                strShort: k.toString(),
                strLong: "Click Target",
              },
              b = {
                strShort: k.toString(),
                strLong: "No Target",
              },
              e = c.length;
            c[e] = {};
            h.push([c[e], a, b]);
            b = {
              strShort: k.toString(),
              strLong: g[0],
            };
            e = d.length;
            d[e] = {};
            h.push([d[e], a, b]);
            k += 1;
          });
        else {
          var e = f.db.get(a);
          $.each(this, function () {
            var a = {
                strShort: k.toString(),
                strLong: "Click Target",
              },
              b = {
                strShort: k.toString(),
                strLong: e.title,
              },
              f = c.length;
            c[f] = {};
            h.push([c[f], a, b]);
            f = d.length;
            d[f] = {};
            h.push([d[f], a, b]);
            k += 1;
          });
        }
      });
      this.scormAPI.process("scoreTest", [
        6,
        {
          id: a.id,
          actualChoice: c,
          isCorrect: e,
          correctChoice: d,
          matchCall: h,
          questionBody: a.body,
          questionWeight: a.weight,
          questionLatency: a.latency,
        },
      ]);
    },
  },
});
DKI.SCORMDataStorage = DKI.DataStorage.extend({
  init: function (a, b, c, d, f) {
    this._parent(a, b, c);
    this.scormInterface = f;
    if (d.subeoid) {
      if ((a = this.getPageFromSubeo(d.subeoid))) this.bookmark = a.id;
    } else this.bookmark = d.GetBookmark;
    this.passingScore = d.GetPassingScore;
    this.status = d.GetStatus;
    this.dataChunk = d.GetDataChunk;
    this.statusPassed = d.LESSON_STATUS_PASSED;
    this.statusFailed = d.LESSON_STATUS_FAILED;
    this.statusComplete = d.LESSON_STATUS_COMPLETED;
    this.studentId = d.GetStudentID;
    this.objLMS = d.objLMS;
    this.lastSection = 0;
    this.storedContentVariables = {};
    this.rootXAPIActivity = null;
    d.rootXAPIActivity && (this.rootXAPIActivity = d.rootXAPIActivity);
    var e = this;
    $(this).on(DKI.DataStorage.events.beforeUnload, function () {
      try {
        e.saveCompletion(null, function () {}, !0);
      } catch (a) {}
      f.process("Unload", []);
    });
  },
  createAssessment: function (a, b, c) {
    return new DKI.SCORMAssessment(a, b, c, this.scormInterface);
  },
  initEvents: function () {
    var a = this;
    $(this).on(DKI.DataStorage.events.pageSelected, function (b, c) {
      a.saveCompletion(c.page);
    });
    $(this).on(
      DKI.DataStorage.events.practiceQuestionSubmitted,
      function (b, c) {
        a.assessment.recordInteraction(c.question, c.questionObject, c.score);
      },
    );
    $(document).on(contentApi.events.dataSet, function (b, c) {
      setTimeout(function () {
        if (playerBehaviour.localVariableStorage)
          try {
            localStorage.setItem(
              a.studentId + "_courseVariables",
              JSON.stringify(a.storedContentVariables),
            );
          } catch (b) {}
      }, 100);
      "incomplete" != a.lessonStatus && a.saveCompletion();
    });
    this.setupXAPITriggers();
    this._parent.initEvents();
    $(document).on(DKI.ContentPage.events.loadFinished, function () {
      $(document).on(
        DKI.ContentPage.events.sectionBottomInView,
        function (b, c) {
          a.lastSection = c;
          a.saveCompletion();
        },
      );
    });
    playerBehaviour.disableOfflineCheck || this.setupOnlineChecks();
    $(document).on(contentApi.events.nextButtonEnabled, function (b, c) {
      a.saveCompletion();
    });
  },
  loadCompletion: function (a) {
    var b = this;
    "" === this.bookmark && (this.bookmark = null);
    var c = this.passinScore,
      d = this.status,
      f = this.dataChunk,
      e = {
        completion: {
          i: [],
          m: [],
          o: [],
          s: [],
          t: [],
          lastSection: 0,
          elements: {},
        },
        contentVariables: {},
        timings: {
          course: 0,
        },
      },
      h = {};
    this._parent.initEvents();
    if ("" !== f) {
      e = "string" == typeof f ? JSON.parse(f) : f;
      e.completion.i =
        "string" == typeof e.completion.i
          ? e.completion.i.split(",")
          : e.completion.i;
      e.completion.m =
        "string" == typeof e.completion.m
          ? e.completion.m.split(",")
          : e.completion.m;
      e.completion.o =
        "string" == typeof e.completion.o
          ? e.completion.o.split(",")
          : e.completion.o;
      e.completion.s =
        "string" == typeof e.completion.s
          ? e.completion.s.split(",")
          : e.completion.s;
      e.completion.t =
        "string" == typeof e.completion.t
          ? e.completion.t.split(",")
          : e.completion.t;
      if (playerBehaviour.localVariableStorage)
        try {
          (h = JSON.parse(
            localStorage.getItem(this.studentId + "_courseVariables"),
          )),
            h["contentVariablesLastUpdated_" + this.courseStructure.courseid] >
              e.contentVariables[
                "contentVariablesLastUpdated_" + this.courseStructure.courseid
              ] &&
              (e.contentVariables = DKI.utility.apply(e.contentVariables, h));
        } catch (l) {}
      e.completion
        ? e.completion.lastSection && (b.lastSection = e.completion.lastSection)
        : (e = {
            completion: e,
          });
      e.contentVariables &&
        (this.storedContentVariables = this.contentVariables =
          DKI.utility.applyIf(e.contentVariables, this.contentVariables));
      e.contentVariableMeta &&
        (this.contentVariableMeta = e.contentVariableMeta);
      e.completion.elements &&
        (this.completion.elements = e.completion.elements);
      e.pagesNextEnabled && (this.pagesNextEnabled = e.pagesNextEnabled);
      this.completion.dataChunk = e;
    } else if (
      ((this.storedContentVariables = this.contentVariables),
      playerBehaviour.localVariableStorage)
    )
      try {
        localStorage.setItem(
          this.studentId + "_courseVariables",
          JSON.stringify(this.storedContentVariables),
        );
      } catch (l) {}
    var g;
    0 < c && (this.passMark = c);
    this.courseTime = e.timings ? e.timings.course : 0;
    b = this;
    e.timings &&
      $.each(e.timings.modules || [], function (a, c) {
        var d;
        $.each(b.courseStructure.modules, function () {
          if (this.loid == a) return (d = this), !1;
        });
        d && (d.parameters.content_time = c);
      });
    if (
      d === this.statusPassed ||
      d === this.statusFailed ||
      d === this.statusComplete
    ) {
      g = e.completion;
      for (c = 0; c < g.t.length; c++)
        g.t[c].pre && this.setModulePre(g.t[c].id, g.t[c].pre),
          g.t[c].post && this.setModulePost(g.t[c].id, g.t[c].post);
      this.markCourseComplete();
    } else if ("" !== f) {
      g = e.completion;
      for (var k = this, c = 0; c < g.i.length; c++)
        this.invalidateModule(g.i[c]);
      for (c = 0; c < g.t.length; c++)
        g.t[c].pre && this.setModulePre(g.t[c].id, g.t[c].pre),
          g.t[c].post && this.setModulePost(g.t[c].id, g.t[c].post);
      for (c = 0; c < g.m.length; c++) this.markModuleComplete(g.m[c]);
      for (c = 0; c < g.o.length; c++) this.markObjectComplete(g.o[c]);
      g.p &&
        ((g.s = []),
        $.each(g.p, function (a, b) {
          (a = k._parent.getSubeoFromPage(b)) && g.s.push(a.subeoid);
        }));
      $.each(g.s, function (a, b) {
        k.markSubeoComplete(b);
      });
    }
    this._parent.loadCompletion(a);
    this.checkCourseComplete();
  },
  getElementCompletion: function (a) {
    return this.completion.elements[a] || !1;
  },
  reconstructWeight: function (a) {
    var b = 0;
    "object" != typeof a && (a = this.findModule(a));
    for (var c = 0; c < a.objects.length; c += 1)
      b =
        a.objects[c].randQuest <= a.objects[c].questions.length
          ? b + a.objects[c].randQuest
          : b + a.objects[c].questions.length;
    return 10 * b;
  },
  sendCompletion: DKI.func.debounce(function (a) {
    this.sendCompletionImmediate.apply(this, arguments);
  }, 1e3),
  sendCompletionImmediate: function (a) {
    var b = JSON.stringify(this.completion.dataChunk);
    this.scormInterface.process(
      "saveCompletion",
      [this.completion.progress, b, this.completion.page],
      a,
    );
    this.completion = {
      progress: null,
      dataChunk: null,
      page: null,
    };
  },
  saveCompletion: function (a, b, c) {
    this.completion.progress = this.getCourseCompletion(!0) / 100;
    this.completion.dataChunk = this.serializeDataChunk();
    a
      ? (this.completion.page = {
          id: a.pageid,
          title: a.title,
        })
      : this.currentPage &&
        (this.completion.page = {
          id: this.currentPage.page_id,
          title: this.currentPage.title,
        });
    "undefined" != typeof c && c
      ? this.sendCompletionImmediate.call(this, b)
      : this.sendCompletion.call(this, b);
  },
  saveElementCompletion: function (a, b, c) {
    if (c) this.completion.dataChunk.completion.elements[c] = a;
    else {
      var d = this;
      $.each(a, function (a, b) {
        d.completion.dataChunk.completion.elements[a] = this;
      });
    }
    this.sendCompletion.call(this, b);
  },
  nextButtonEnabled: function (a) {
    a = a || this.currentPage.page;
    this.pagesNextEnabled[a.pageid] || this._parent.nextButtonEnabled(a);
  },
  serializeDataChunk: function () {
    for (
      var a,
        b,
        c = {
          i: [],
          m: [],
          o: [],
          s: [],
          t: [],
          lastSection: this.lastSection,
          elements: {},
        },
        d = {
          course: this.courseTime,
        },
        f = 0;
      f < this.courseStructure.modules.length;
      f++
    ) {
      a = this.courseStructure.modules[f];
      this.courseStructure.modules[f].invalidated && (c.i[c.i.length] = a.loid);
      a.hasContentTimer &&
        ((b = d.modules || {}),
        (b[a.loid] = a.parameters.content_time),
        (d.modules = b));
      if (a.complete) c.m[c.m.length] = a.loid;
      else
        for (var e = 0; e < a.objects.length; e++)
          if (((b = a.objects[e]), b.complete)) c.o[c.o.length] = b.objectid;
          else
            for (var h = 0; h < b.subeos.length; h++)
              b.subeos[h].complete && (c.s[c.s.length] = b.subeos[h].subeoid);
      if (a.pre || a.post)
        (b = {
          id: a.loid,
        }),
          a.pre && (b.pre = a.pre),
          a.post && (b.post = a.post),
          (c.t[c.t.length] = b);
    }
    a = {
      completion: c,
    };
    a.contentVariables = this.storedContentVariables;
    a.contentVariableMeta = this.contentVariableMeta;
    a.completion.elements = this.completion.elements;
    a.pagesNextEnabled = this.pagesNextEnabled;
    return a;
  },
  setModulePre: function (a, b) {
    a = "object" == typeof a ? a : this.findModule(a);
    var c = "object" == typeof b ? b.score : b,
      d = "object" == typeof b ? b.weight : this.reconstructWeight(a);
    b =
      "object" == typeof b
        ? b.points
        : parseFloat(((c / 100) * d).toFixed(1), 10);
    b == Math.round(b) && (b = parseInt(b, "10"));
    a.pre = {
      score: c,
      weight: d,
      points: b,
    };
  },
  setModulePost: function (a, b) {
    a = "object" == typeof a ? a : this.findModule(a);
    b.weight || (b.weight = this.reconstructWeight(a));
    b.points ||
      (b.points = parseFloat(((b.score / 100) * b.weight).toFixed(1), 10));
    b.points == Math.round(b.points) && (b.points = parseInt(b.points, "10"));
    a.post = b;
    this.courseStructure.testonly &&
      "0" == this.remainingPostAttempts(a) &&
      (a.complete = !0);
  },
  markCourseComplete: function () {
    for (var a = 0; a < this.courseStructure.modules.length; a++)
      this.markModuleComplete(this.courseStructure.modules[a]);
  },
  createTest: function (a, b) {
    this._parent.createTest(a, b);
    this.saveCompletion();
  },
  onCourseComplete: function () {
    this._parent.onCourseComplete();
    switch (playerBehaviour.completionStatus) {
      case 1:
        switch (this.lessonStatus) {
          case "passed":
            this.scormInterface.process("SetScore", [
              this.getCourseScore(),
              100,
              0,
            ]);
            this.scormInterface.process("SetReachedEnd");
            this.scormInterface.process("SetPassed");
            break;
          case "failed":
            this.scormInterface.process("SetScore", [
              this.getCourseScore(),
              100,
              0,
            ]);
            this.scormInterface.process("SetReachedEnd");
            this.scormInterface.process("SetFailed");
            break;
          case "complete":
            this.scormInterface.process("SetReachedEnd"),
              this.scormInterface.process("SetPassed");
        }
        break;
      case 2:
        if ("complete" == this.lessonStatus || "passed" == this.lessonStatus)
          "passed" == this.lessonStatus &&
            this.scormInterface.process("SetScore", [
              this.getCourseScore(),
              100,
              0,
            ]),
            this.scormInterface.process("SetReachedEnd");
        break;
      case 3:
        "complete" == this.lessonStatus || "passed" == this.lessonStatus
          ? ("passed" == this.lessonStatus &&
              this.scormInterface.process("SetScore", [
                this.getCourseScore(),
                100,
                0,
              ]),
            this.scormInterface.process("SetReachedEnd"))
          : "failed" == this.lessonStatus &&
            (this.scormInterface.process("SetScore", [
              this.getCourseScore(),
              100,
              0,
            ]),
            this.scormInterface.process("SetReachedEnd"),
            this.scormInterface.process("SetFailed"));
        break;
      case 4:
        "complete" == this.lessonStatus || "passed" == this.lessonStatus
          ? ("passed" == this.lessonStatus &&
              this.scormInterface.process("SetScore", [
                this.getCourseScore(),
                100,
                0,
              ]),
            this.scormInterface.process("SetReachedEnd"),
            this.scormInterface.process("SetPassed"))
          : "failed" == this.lessonStatus &&
            (this.scormInterface.process("SetScore", [
              this.getCourseScore(),
              100,
              0,
            ]),
            this.scormInterface.process("SetReachedEnd"),
            this.scormInterface.process("SetFailed"));
        break;
      case 5:
        if ("complete" == this.lessonStatus || "passed" == this.lessonStatus)
          "passed" == this.lessonStatus &&
            this.scormInterface.process("SetScore", [
              this.getCourseScore(),
              100,
              0,
            ]),
            this.scormInterface.process("SetReachedEnd"),
            this.scormInterface.process("SetPassed");
    }
    var a = this;
    this.scormInterface.process("GetStatus", [], function (b) {
      a.status = b;
    });
    this.saveCompletion();
  },
  onAssessmentComplete: function () {
    var a;
    this._parent.onAssessmentComplete();
    "SCORM2004" === this.objLMS.Standard &&
      this.scormInterface.process("SetScore", [this.getCourseScore(), 100, 0]);
    this.courseStructure.testonly &&
      ((a = this.getNextModule(this.assessment.module))
        ? this.scormInterface.process("SetBookmark", [a.loid, a.name])
        : this.scormInterface.process("SetBookmark", ["", ""]));
    this.saveCompletion();
  },
  getUserID: function () {
    return this.studentId;
  },
  get: function (a) {
    return this[a];
  },
  doExit: function () {
    this.scormInterface.process(
      "doExit",
      [this.lessonStatus],
      $.proxy(function () {
        "" !== this.behaviour.exitFunction && eval(this.behaviour.exitFunction);
        this.behaviour.launchInNewWindow && window.close();
      }, this),
    );
  },
  setupXAPITriggers: function () {
    $(document).on(
      DKI.courseStore.events.elementRegistered,
      $.proxy(function (a, b) {
        this.store.elements[b.elementid] = b;
        b.upload_id &&
          this.setRelationship("assetElement", b.upload_id, b.elementid);
        if (
          "htm" == b.elementtype ||
          "table" == b.elementtype ||
          "authoringButton" == b.elementtype
        ) {
          var c = this;
          $("\x3cdiv\x3e" + b.meta.replace(/src=/g, "") + "\x3c/div\x3e")
            .find(".dki-glossary-link")
            .each(function () {
              var a = $(this).data("id");
              c.setRelationship("glossaryElement", a, b.elementid);
            });
        }
      }, this),
    );
  },
  setupOnlineChecks: function () {
    var a = !0,
      b = null,
      c = null,
      d = new DKI.disabler({
        text: "There was an error communicating with the LMS.\x3cbr /\x3e\x3cbr /\x3eWe are not detecting an internet connection. Please check your connection to resume.",
        clickable: !1,
        className: "textMessage",
      }),
      f = d.disabler.find(".disablerMessage"),
      e = null;
    d.disabler.style("z-index", 1e4);
    var h = function () {
        a ||
          navigator.onLine ||
          (clearInterval(b),
          (c = setInterval(g, 1500)),
          d.show(),
          (e = document.activeElement),
          f.attr("tabindex", "1"),
          f[0].focus(),
          DKI.enforceFocus(f));
        a = navigator.onLine;
      },
      g = function () {
        a &&
          navigator.onLine &&
          (clearInterval(c),
          (b = setInterval(h, 1500)),
          DKI.enforceFocus(!1),
          e && (e.focus(), (e = null)),
          f.attr("tabindex", "0"),
          d.hide());
        a = navigator.onLine;
      },
      b = setInterval(h, 1500);
  },
});
DKI.scormInterface = $.Class({
  init: function (a) {
    this.localAPI = !a.isStub;
    this.queue = {};
    this.localAPI
      ? (this.scormAPI = a.scormAPI)
      : Porthole &&
        this.getQueryParameters("portURL") &&
        ((this.scormAPI = new Porthole.WindowProxy(
          this.getQueryParameters("portURL"),
        )),
        this.scormAPI.addEventListener(this.proxyMessageReceived));
    $(document).on(
      DKI.scormInterface.events.messageReceived,
      $.proxy(this.resolveQueue, this),
    );
  },
});
DKI.scormInterface.prototype.getQueryParameters = function (a) {
  a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  a = new RegExp("[\\?\x26]" + a + "\x3d([^\x26#]*)").exec(location.search);
  return null === a ? "" : decodeURIComponent(a[1].replace(/\+/g, " "));
};
DKI.scormInterface.prototype.proxyMessageReceived = function (a) {
  $(document).trigger(DKI.scormInterface.events.messageReceived, [a]);
};
DKI.scormInterface.prototype.resolveQueue = function (a, b) {
  a = b.data;
  a.id && (this.queue[a.id].callback(b.data.args), delete this.queue[a.id]);
};
DKI.scormInterface.prototype.process = function (a, b, c) {
  var d = this.createGUID();
  this.queue[d] = {
    callback: c ? c : function () {},
  };
  this.callAPI(a, b, d);
};
DKI.scormInterface.prototype.callAPI = function (a, b, c) {
  a = DKI.applyIf(
    {
      action: a,
      args: b,
      id: c,
    },
    {
      action: "",
      args: [],
      id: 0,
    },
  );
  this.localAPI
    ? this.scormAPI.process(a, function (a) {
        $(document).trigger(DKI.scormInterface.events.messageReceived, [
          {
            data: {
              id: c,
              args: a.args,
            },
          },
        ]);
      })
    : this.scormAPI.post(a);
};
DKI.scormInterface.prototype.createGUID = function (a) {
  function b() {
    return ((65536 * (1 + Math.random())) | 0).toString(16).substring(1);
  }
  a = a || "-";
  return b() + b() + a + b() + a + b() + a + b() + a + b() + b() + b();
};
DKI.scormInterface.events = {
  messageReceived: "SCORM_API_MESSAGE_RECEIVED",
};
