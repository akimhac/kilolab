import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function SetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // États du formulaire
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Params (ton ancien flow invite)
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  // Supabase recovery flow met souvent les tokens dans le hash
  const hashParams = useMemo(
    () => new URLSearchParams((window.location.hash || "").replace("#", "")),
    []
  );
  const access_token = hashParams.get("access_token") || searchParams.get("access_token");
  const refresh_token = hashParams.get("refresh_token") || searchParams.get("refresh_token");
  const type = hashParams.get("type") || searchParams.get("type"); // recovery/invite
  const code = searchParams.get("code");

  // Init session
  useEffect(() => {
    const init = async () => {
      try {
        // ✅ Cas 1 : recovery link (access_token / refresh_token)
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (error) throw error;
          setSessionReady(true);
          return;
        }

        // ✅ Cas 2 : PKCE / code
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          setSessionReady(true);
          return;
        }

        // ✅ Cas 3 : invite (email + token)
        if (email && token) {
          // on garde ton flow
          const { error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: "invite",
          });
          if (error) throw error;
          setSessionReady(true);
          return;
        }

        // ❌ Aucun format reconnu
        toast.error("Lien invalide ou expiré");
        navigate("/");
      } catch (err: any) {
        console.error("Init error:", err);
        toast.error(err?.message || "Lien invalide ou expiré");
        navigate("/");
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionReady) {
      toast.error("Session non prête, recharge le lien.");
      return;
    }

    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      // ✅ Mettre à jour le mot de passe
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      if (updateError) throw updateError;

      // Optionnel : flag dans ton user_profiles
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData?.user?.email || email;

      if (userEmail) {
        await supabase
          .from("user_profiles")
          .update({
            password_set: true,
            updated_at: new Date().toISOString(),
          })
          .eq("email", userEmail);
      }

      toast.success("Compte activé avec succès ! Bienvenue 🚀");

      // ✅ Là tu peux envoyer direct vers le dashboard washer si tu veux
      setTimeout(() => {
        navigate("/washer-dashboard");
      }, 800);
    } catch (error: any) {
      console.error("Erreur:", error);
      if ((error?.message || "").toLowerCase().includes("token")) {
        toast.error("Ce lien a expiré ou a déjà été utilisé.");
      } else {
        toast.error(error?.message || "Erreur lors de l'activation");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <Lock className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Créez votre mot de passe</h1>
          <p className="text-gray-600">
            Votre compte a été validé ! Définissez votre mot de passe pour accéder à votre espace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                placeholder="Minimum 8 caractères"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirmation */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirmer</label>
            <div className="relative">
              <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                placeholder="Confirmez le mot de passe"
                required
                minLength={8}
              />
            </div>
          </div>

          {/* Indicateur */}
          {password.length > 0 && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className={`h-2 flex-1 rounded ${password.length >= 8 ? "bg-teal-500" : "bg-gray-200"}`} />
                <div className={`h-2 flex-1 rounded ${password.length >= 10 ? "bg-teal-500" : "bg-gray-200"}`} />
                <div className={`h-2 flex-1 rounded ${password.length >= 12 ? "bg-teal-500" : "bg-gray-200"}`} />
              </div>
              <p className="text-xs text-gray-500 text-right">
                {password.length < 8 && "Trop court"}
                {password.length >= 8 && password.length < 10 && "Moyen"}
                {password.length >= 10 && "Fort 💪"}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || password.length < 8 || password !== confirmPassword}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Activation en cours..." : "Activer mon compte"}
          </button>
        </form>
      </div>
    </div>
  );
}
