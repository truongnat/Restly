(() => {
  const endpointChoice = "/api/choice";
  const endpointEvent = "/api/event";

  function meta() {
    const root = document.documentElement;
    return {
      issue_id:
        root.dataset.issueId ||
        document.querySelector("[data-issue-id]")?.getAttribute("data-issue-id") ||
        null,
      session: root.dataset.session || null,
      title: document.title,
    };
  }

  async function post(url, payload) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      throw new Error(data.error || `request failed (${response.status})`);
    }
    return data;
  }

  function ensureBanner() {
    let banner = document.getElementById("decision-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "decision-banner";
      document.body.prepend(banner);
    }
    banner.setAttribute("role", "status");
    banner.setAttribute("aria-live", "polite");
    if (!banner.querySelector(".ss-banner-inner")) {
      banner.innerHTML =
        '<div class="ss-banner-inner">' +
        '<div class="ss-banner-mark" aria-hidden="true"></div>' +
        '<div class="ss-banner-copy"><strong></strong><span></span></div>' +
        "</div>";
    }
    return banner;
  }

  function setBanner(state, title, detail) {
    const banner = ensureBanner();
    banner.dataset.state = state;
    const mark = banner.querySelector(".ss-banner-mark");
    const strong = banner.querySelector(".ss-banner-copy strong");
    const span = banner.querySelector(".ss-banner-copy span");
    if (!mark || !strong || !span) {
      banner.textContent = `${title}${detail ? ` — ${detail}` : ""}`;
      banner.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    mark.textContent =
      state === "ok"
        ? "✓"
        : state === "error"
          ? "!"
          : state === "info"
            ? "i"
            : "…";
    strong.textContent = title;
    span.textContent = detail || "";
    banner.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function optionRoot(button) {
    return (
      button.closest(".ss-option, .option, article, [data-choice-option]") ||
      button.parentElement
    );
  }

  function markSelection(selectedButton) {
    const selected = optionRoot(selectedButton);
    document.querySelectorAll("[data-choice]").forEach((button) => {
      const root = optionRoot(button);
      const isSelected = button === selectedButton;
      // Keep enabled so the user can change their mind; choice-reader uses latest.
      if (button.matches("button, [role='button']")) {
        button.disabled = false;
      }
      if (!root) {
        return;
      }
      root.classList.toggle("is-selected", isSelected);
      root.classList.toggle("is-dimmed", !isSelected);
      root.querySelectorAll(".ss-selected-badge").forEach((node) => node.remove());
      if (isSelected) {
        const badge = document.createElement("span");
        badge.className = "ss-tag ss-selected-badge";
        badge.textContent = "Selected";
        root.prepend(badge);
      }
    });
    if (selected) {
      selected.classList.add("is-selected");
      selected.classList.remove("is-dimmed");
    }
  }

  function setChoicesBusy(busy) {
    document.querySelectorAll("button[data-choice]").forEach((button) => {
      button.disabled = Boolean(busy);
    });
  }

  async function recordChoice(choice, note, issueId) {
    const base = meta();
    const payload = {
      issue_id: issueId || base.issue_id,
      choice,
      note: note || "",
      session: base.session,
      meta: { title: base.title, href: location.href },
    };
    if (!payload.issue_id) {
      throw new Error("missing issue_id (set data-issue-id on <html> or button)");
    }
    return post(endpointChoice, payload);
  }

  async function recordEvent(type, extra) {
    const base = meta();
    return post(endpointEvent, {
      type,
      issue_id: base.issue_id,
      session: base.session,
      payload: extra || {},
    });
  }

  function noteFromContext(el) {
    const field = el
      .closest("section, form, .ss-card, .ss-option")
      ?.querySelector("[data-ss-note], textarea.ss-textarea, input.ss-input[name='note']");
    if (field && "value" in field) {
      return String(field.value || "").trim();
    }
    return el.getAttribute("data-note") || "";
  }

  async function handleChoice(el) {
    if (el.disabled) {
      return;
    }
    const choice = el.getAttribute("data-choice");
    if (!choice) {
      return;
    }
    const issueId = el.getAttribute("data-issue-id");
    const note = noteFromContext(el);
    const label = (el.textContent || el.getAttribute("aria-label") || choice).trim();
    try {
      setChoicesBusy(true);
      setBanner("pending", "Saving your choice…", `${label} (${choice})`);
      await recordChoice(choice, note, issueId);
      markSelection(el);
      setBanner(
        "ok",
        "Choice recorded",
        `${label} → ${choice}. Click another option to change.`
      );
      await recordEvent("choice_ui_ack", { choice });
    } catch (err) {
      setBanner("error", "Could not save choice", String(err.message || err));
      setChoicesBusy(false);
    }
  }

  function wireButtons() {
    document.querySelectorAll("button[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        handleChoice(button);
      });
    });
  }

  function wireChoiceInputs() {
    document
      .querySelectorAll(
        "input[type='radio'][data-choice], input[type='checkbox'][data-choice]"
      )
      .forEach((input) => {
        input.addEventListener("change", () => {
          if (input.type === "checkbox" && !input.checked) {
            return;
          }
          if (input.type === "radio" && !input.checked) {
            return;
          }
          handleChoice(input);
        });
      });
  }

  function wireTabs() {
    document.querySelectorAll("[data-ss-tabs]").forEach((root) => {
      const tabs = [...root.querySelectorAll("[data-ss-tab]")];
      let panelRoot = root.querySelector(".ss-panels");
      if (!panelRoot && root.nextElementSibling?.matches?.(".ss-panels")) {
        panelRoot = root.nextElementSibling;
      }
      if (!panelRoot) {
        panelRoot = root.parentElement?.querySelector(".ss-panels");
      }
      if (!tabs.length || !panelRoot) {
        return;
      }
      const panels = [...panelRoot.querySelectorAll("[data-ss-panel]")];

      function activate(id) {
        tabs.forEach((tab) => {
          const on = tab.getAttribute("data-ss-tab") === id;
          tab.classList.toggle("is-active", on);
          tab.setAttribute("aria-selected", on ? "true" : "false");
          tab.tabIndex = on ? 0 : -1;
        });
        panels.forEach((panel) => {
          const on = panel.getAttribute("data-ss-panel") === id;
          panel.hidden = !on;
        });
        recordEvent("ui_tab", { tab: id }).catch(() => {});
      }

      tabs.forEach((tab) => {
        tab.setAttribute("role", "tab");
        tab.addEventListener("click", () => {
          activate(tab.getAttribute("data-ss-tab"));
        });
      });
      panelRoot.setAttribute("role", "tabpanel");
      const initial =
        tabs.find((t) => t.getAttribute("aria-selected") === "true") ||
        tabs.find((t) => t.classList.contains("is-active")) ||
        tabs[0];
      if (initial) {
        activate(initial.getAttribute("data-ss-tab"));
      }
    });
  }

  function wireCompare() {
    document.querySelectorAll("[data-ss-compare-root]").forEach((root) => {
      const compare = root.querySelector(".ss-compare") || root;
      const toggles = root.querySelectorAll("[data-ss-show]");
      const panes = {
        before: compare.querySelector('[data-ss-pane="before"]'),
        after: compare.querySelector('[data-ss-pane="after"]'),
      };

      function setMode(mode) {
        compare.dataset.ssMode = mode;
        toggles.forEach((btn) => {
          const on = btn.getAttribute("data-ss-show") === mode;
          btn.classList.toggle("is-active", on);
          btn.setAttribute("aria-pressed", on ? "true" : "false");
        });
        if (panes.before) {
          panes.before.hidden = mode === "after";
        }
        if (panes.after) {
          panes.after.hidden = mode === "before";
        }
        recordEvent("ui_compare", { mode }).catch(() => {});
      }

      toggles.forEach((btn) => {
        btn.classList.add("ss-btn");
        btn.addEventListener("click", () => {
          setMode(btn.getAttribute("data-ss-show") || "both");
        });
      });
      const start =
        root.getAttribute("data-ss-mode") ||
        compare.getAttribute("data-ss-mode") ||
        "both";
      setMode(start);
    });
  }

  function wireOptionKeyboard() {
    document.querySelectorAll(".ss-options").forEach((group) => {
      const buttons = [...group.querySelectorAll("button[data-choice]")];
      if (buttons.length < 2) {
        return;
      }
      group.addEventListener("keydown", (event) => {
        if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) {
          return;
        }
        const current = document.activeElement;
        const index = buttons.indexOf(current);
        if (index < 0) {
          return;
        }
        event.preventDefault();
        const delta =
          event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
        const next = buttons[(index + delta + buttons.length) % buttons.length];
        next.focus();
      });
    });
  }

  function wireStaticPreview() {
    if (location.protocol !== "file:") {
      return;
    }
    setBanner(
      "info",
      "Static preview",
      "Layout loads via CDN + local theme. Serve with session-serve to record choices."
    );
  }

  window.SimpleSkillsDecision = {
    recordChoice,
    recordEvent,
    setBanner,
  };

  function wireReveals() {
    const nodes = document.querySelectorAll(
      ".ss-reveal, main.ss-main > section, main.ss-main > .ss-grid"
    );
    if (!nodes.length) {
      return;
    }
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    nodes.forEach((node, index) => {
      if (!node.classList.contains("ss-reveal")) {
        node.classList.add("ss-reveal");
      }
      node.style.transitionDelay = `${Math.min(index * 40, 200)}ms`;
      observer.observe(node);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureBanner();
    wireButtons();
    wireChoiceInputs();
    wireTabs();
    wireCompare();
    wireOptionKeyboard();
    wireReveals();
    wireStaticPreview();
    if (location.protocol !== "file:") {
      recordEvent("page_view", { path: location.pathname }).catch(() => {});
    }
  });
})();
