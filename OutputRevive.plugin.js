/**
 * @name OutputRevive
 * @author poet
 * @version 1.0.0
 * @description Revives your output device with one click.
 */

module.exports = class ResetOutput {
    constructor() {
        this.observer = null;
    }

    start() {
        this.addObserver();
    }

    stop() {
        if (this.observer) this.observer.disconnect();
        this.removeResetButton();
    }

    addObserver() {
        const observer = new MutationObserver(() => ResetOutput.addResetButton());
        this.observer = observer;
        observer.observe(document.body, { childList: true, subtree: true });
    }

    static async addResetButton() {
        let deafenBtn = document.querySelector("button[aria-label='Deafen']");
        if (!deafenBtn || document.querySelector("#resetOutputBtn")) return;

        let resetBtn = deafenBtn.cloneNode(true);
        resetBtn.id = "resetOutputBtn";
        resetBtn.setAttribute("aria-label", "Reset Output");

        // --- Remove Discord’s default SVG icon ---
        let svg = resetBtn.querySelector("svg");
        if (svg) svg.remove();

        // --- Make button invisible so only image shows ---
        resetBtn.style.background = "transparent";
        resetBtn.style.border = "none";
        resetBtn.style.boxShadow = "none";
        resetBtn.style.padding = "0";
        resetBtn.style.marginLeft = "10px";
        resetBtn.style.display = "flex";
        resetBtn.style.alignItems = "center";
        resetBtn.style.justifyContent = "center";

        // --- Add custom image ---
        let img = document.createElement("img");
        img.src = "https://files.catbox.moe/ymoncl.png"; // Change this URL or use base64
        img.style.width = "44px";
        img.style.height = "44px";
        img.style.objectFit = "contain";
        img.style.pointerEvents = "none"; // so clicks still hit the button

        resetBtn.prepend(img);

        resetBtn.onclick = async () => {
            try {
                // --- Output reset ---
                const AudioModule = BdApi.Webpack.getModule(
                    (m) =>
                        m &&
                        typeof m === "object" &&
                        typeof m.setOutputDevice === "function"
                );

                if (!AudioModule || typeof AudioModule.setOutputDevice !== "function") {
                    BdApi.showToast("❌ Could not find output device module!", { type: "error" });
                    console.log("ResetOutput debug: No module with setOutputDevice found.", AudioModule);
                    return;
                }

                await AudioModule.setOutputDevice("default");

                BdApi.showToast("OUTPUT DEVICE REBOOTED - MADE BY POET", { type: "success" });

            } catch (err) {
                console.error("ResetOutput error:", err);
                BdApi.showToast("❌ Output reset failed. Check console for details.", { type: "error" });
            }
        };

        deafenBtn.parentNode.appendChild(resetBtn);
    }

    removeResetButton() {
        let resetBtn = document.querySelector("#resetOutputBtn");
        if (resetBtn) resetBtn.remove();
    }

};
