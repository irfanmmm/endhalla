require 'xcodeproj'

project_path = 'ios/Endhalla.xcodeproj'
project = Xcodeproj::Project.open(project_path)

main_target = project.targets.find { |t| t.name == 'Endhalla' }
if main_target
  bundle_phase = main_target.shell_script_build_phases.find { |p| p.name == 'Bundle React Native code and images' }
  if bundle_phase
    # Ensure it's not already modified
    unless bundle_phase.shell_script.include?('ENTRY_FILE')
      new_script = %Q(
export APP_TARGET=${APP_TARGET:-client}
export ENTRY_FILE=${PODS_ROOT}/../../index.${APP_TARGET}.js
) + bundle_phase.shell_script
      bundle_phase.shell_script = new_script
      puts "Updated iOS Bundle React Native code and images phase."
    end
  end
end

project.save
